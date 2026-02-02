import { useState, useRef } from 'react'
import { storageApi } from '../lib/supabase'

// Target dimensions for consistent images (4:3 aspect ratio)
const TARGET_WIDTH = 800
const TARGET_HEIGHT = 600
const ASPECT_RATIO = TARGET_WIDTH / TARGET_HEIGHT

// Process image: fit entire image within 4:3 frame (no cropping)
function processImage(file) {
    return new Promise((resolve, reject) => {
        const img = new Image()
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')

        img.onload = () => {
            // Set canvas to target dimensions
            canvas.width = TARGET_WIDTH
            canvas.height = TARGET_HEIGHT

            // Fill with white background
            ctx.fillStyle = '#FFFFFF'
            ctx.fillRect(0, 0, TARGET_WIDTH, TARGET_HEIGHT)

            // Calculate dimensions to fit entire image (no cropping)
            const imgAspect = img.width / img.height
            let drawWidth, drawHeight, drawX, drawY

            if (imgAspect > ASPECT_RATIO) {
                // Image is wider than 4:3, fit to width
                drawWidth = TARGET_WIDTH
                drawHeight = TARGET_WIDTH / imgAspect
                drawX = 0
                drawY = (TARGET_HEIGHT - drawHeight) / 2
            } else {
                // Image is taller than 4:3, fit to height
                drawHeight = TARGET_HEIGHT
                drawWidth = TARGET_HEIGHT * imgAspect
                drawX = (TARGET_WIDTH - drawWidth) / 2
                drawY = 0
            }

            // Draw the entire image (no cropping)
            ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight)

            // Convert to blob
            canvas.toBlob(
                (blob) => {
                    if (blob) {
                        // Create new file with same name
                        const processedFile = new File([blob], file.name, {
                            type: 'image/jpeg',
                            lastModified: Date.now()
                        })
                        resolve(processedFile)
                    } else {
                        reject(new Error('Failed to process image'))
                    }
                },
                'image/jpeg',
                0.9 // Quality
            )
        }

        img.onerror = () => reject(new Error('Failed to load image'))

        // Load image from file
        const reader = new FileReader()
        reader.onload = (e) => {
            img.src = e.target.result
        }
        reader.onerror = () => reject(new Error('Failed to read file'))
        reader.readAsDataURL(file)
    })
}

export default function ImageUpload({ value, onChange }) {
    const [isDragging, setIsDragging] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [error, setError] = useState(null)
    const fileInputRef = useRef(null)

    const handleDragOver = (e) => {
        e.preventDefault()
        setIsDragging(true)
    }

    const handleDragLeave = (e) => {
        e.preventDefault()
        setIsDragging(false)
    }

    const handleDrop = (e) => {
        e.preventDefault()
        setIsDragging(false)

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0])
        }
    }

    const handleClick = () => {
        fileInputRef.current.click()
    }

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0])
        }
    }

    const handleFile = async (file) => {
        if (!file.type.startsWith('image/')) {
            setError('Please upload an image file')
            return
        }

        if (file.size > 10 * 1024 * 1024) {
            setError('Image must be smaller than 10MB')
            return
        }

        setUploading(true)
        setError(null)

        try {
            // Process image to consistent size and aspect ratio
            const processedFile = await processImage(file)
            const url = await storageApi.uploadImage(processedFile)
            onChange(url)
        } catch (err) {
            console.error('Upload error:', err)
            setError(err.message || 'Failed to upload image')
        } finally {
            setUploading(false)
        }
    }

    const handleRemove = async (e) => {
        e.stopPropagation()

        if (value && value.includes('product-images')) {
            try {
                await storageApi.deleteImage(value)
            } catch (err) {
                console.error('Delete error:', err)
            }
        }

        onChange(null)
    }

    return (
        <div className="form-group">
            <label className="form-label">Product Image</label>

            {error && (
                <div style={{
                    background: '#ffebeb',
                    color: '#ef476f',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    marginBottom: '12px',
                    fontSize: '13px'
                }}>
                    {error}
                </div>
            )}

            {value ? (
                <div className="image-preview">
                    <img src={value} alt="Product preview" />
                    <div className="image-preview-overlay">
                        <button
                            type="button"
                            className="btn btn-secondary btn-small"
                            onClick={handleRemove}
                        >
                            Remove / Replace
                        </button>
                    </div>
                </div>
            ) : (
                <div
                    className={`image-upload-zone ${isDragging ? 'active' : ''} ${uploading ? 'uploading' : ''}`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={uploading ? undefined : handleClick}
                    style={{ cursor: uploading ? 'wait' : 'pointer' }}
                >
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/*"
                        style={{ display: 'none' }}
                        disabled={uploading}
                    />
                    {uploading ? (
                        <>
                            <div className="loading-spinner" style={{ margin: '0 auto 12px' }}></div>
                            <p style={{ fontWeight: 600, color: 'var(--color-dark)' }}>
                                Processing & uploading...
                            </p>
                        </>
                    ) : (
                        <>
                            <div style={{ fontSize: '24px', marginBottom: '12px' }}>📸</div>
                            <p style={{ fontWeight: 600, color: 'var(--color-dark)' }}>
                                Click or drag photo here
                            </p>
                            <p style={{ fontSize: '13px', color: 'var(--color-gray-text)' }}>
                                Resized to 800x600 (full image preserved)
                            </p>
                        </>
                    )}
                </div>
            )}
        </div>
    )
}
