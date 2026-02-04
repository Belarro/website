import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://gcgscmtjesyiziebutzw.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdjZ3NjbXRqZXN5aXppZWJ1dHp3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAwNDQwMjgsImV4cCI6MjA4NTYyMDAyOH0.Ikf7mpFUKPJx9wA827xHTxSV2u5JpWCPw7j6wiKbgN0'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Storage API for image uploads
export const storageApi = {
  async uploadImage(file) {
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
    const filePath = `products/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (uploadError) throw uploadError

    const { data } = supabase.storage
      .from('product-images')
      .getPublicUrl(filePath)

    return data.publicUrl
  },

  async deleteImage(url) {
    if (!url || !url.includes('product-images')) return

    const path = url.split('product-images/')[1]
    if (path) {
      await supabase.storage
        .from('product-images')
        .remove([path])
    }
  }
}

// Products API
export const productsApi = {
  async getAll() {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('sort_order', { ascending: true })

    if (error) throw error
    return data
  },

  async getById(id) {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  },

  async create(product) {
    const { data, error } = await supabase
      .from('products')
      .insert([{
        ...product,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single()

    if (error) throw error
    return data
  },

  async update(id, updates) {
    const updatePayload = {
      ...updates,
      updated_at: new Date().toISOString()
    }

    const { data, error } = await supabase
      .from('products')
      .update(updatePayload)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async delete(id) {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id)

    if (error) throw error
  },

  async getAllTags() {
    const { data, error } = await supabase
      .from('products')
      .select('tags')

    if (error) throw error

    // Collect all unique tags from all products
    const allTags = new Set()
    data.forEach(product => {
      if (product.tags && Array.isArray(product.tags)) {
        product.tags.forEach(tag => allTags.add(tag))
      }
    })
    return Array.from(allTags).sort()
  }
}

// Kitchens API
export const kitchensApi = {
  async getAll() {
    const { data, error } = await supabase
      .from('kitchens')
      .select('*')
      .order('kitchen_name', { ascending: true })

    if (error) throw error
    return data
  },

  async getById(id) {
    const { data, error } = await supabase
      .from('kitchens')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  },

  async create(kitchen) {
    const { data, error } = await supabase
      .from('kitchens')
      .insert([{
        ...kitchen,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single()

    if (error) throw error
    return data
  },

  async update(id, updates) {
    const { data, error } = await supabase
      .from('kitchens')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async delete(id) {
    const { error } = await supabase
      .from('kitchens')
      .delete()
      .eq('id', id)

    if (error) throw error
  }
}

// Users API
export const usersApi = {
  async getAll() {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  async getById(id) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  },

  async create(user) {
    const { data, error } = await supabase
      .from('users')
      .insert([{
        ...user,
        created_at: new Date().toISOString()
      }])
      .select()
      .single()

    if (error) throw error
    return data
  },

  async update(id, updates) {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async delete(id) {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', id)

    if (error) throw error
  }
}
