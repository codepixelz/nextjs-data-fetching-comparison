'use server'

import { revalidateTag, revalidatePath } from 'next/cache'

/**
 * Server Actions for Cache Revalidation Demo
 *
 * These actions demonstrate different cache invalidation strategies:
 * 1. revalidateTag - Invalidate cache by tag
 * 2. revalidatePath - Invalidate cache by path
 * 3. Combined strategies
 */

/**
 * Add a new product (simulated)
 * Revalidates the 'products' tag to refresh all product-related caches
 */
export async function addProduct(formData: FormData) {
  const name = formData.get('name') as string
  const price = formData.get('price') as string

  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 500))

  // In a real app, you would save to database here
  console.log('Adding product:', { name, price })

  // Revalidate all caches tagged with 'products'
  revalidateTag('products', {})

  return {
    success: true,
    message: `Product "${name}" added successfully!`,
  }
}

/**
 * Update a product (simulated)
 * Demonstrates revalidating a specific path
 */
export async function updateProduct(id: string, updates: { name?: string; price?: number }) {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 500))

  console.log('Updating product:', id, updates)

  // Option 1: Revalidate specific product path
  revalidatePath(`/api/products/${id}`)

  // Option 2: Revalidate all products (more aggressive)
  revalidateTag('products', {})

  return {
    success: true,
    message: 'Product updated successfully!',
  }
}

/**
 * Delete a product (simulated)
 * Demonstrates combined revalidation strategies
 */
export async function deleteProduct(id: string) {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 500))

  console.log('Deleting product:', id)

  // Revalidate both the specific product and the list
  revalidatePath(`/api/products/${id}`)
  revalidateTag('products', {})

  return {
    success: true,
    message: 'Product deleted successfully!',
  }
}

/**
 * Revalidate entire approach path
 * Useful for full page refresh
 */
export async function revalidateApproachPath(path: string) {
  revalidatePath(path)

  return {
    success: true,
    message: `Path "${path}" revalidated successfully!`,
  }
}

/**
 * Revalidate by tag
 * Demonstrates granular cache control
 */
export async function revalidateByTag(tag: string) {
  revalidateTag(tag, {})

  return {
    success: true,
    message: `Tag "${tag}" revalidated successfully!`,
  }
}

/**
 * Bulk update products (simulated)
 * Demonstrates when to use path vs tag revalidation
 */
export async function bulkUpdateProducts() {
  // Simulate bulk operation
  await new Promise(resolve => setTimeout(resolve, 1000))

  console.log('Bulk updating products')

  // For bulk operations, use tag revalidation (more efficient than multiple paths)
  revalidateTag('products', {})

  return {
    success: true,
    message: 'Bulk update completed!',
  }
}
