import { User, ApiResponse } from '@/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

/**
 * Async Server Component - User Profile
 *
 * Fetches user data on the server
 */
export async function UserProfile({ userId }: { userId: string }) {
  // Server-side fetch with Next.js Data Cache
  const response = await fetch(`http://localhost:3000/api/users/${userId}`, {
    next: {
      revalidate: 120, // Revalidate every 2 minutes
      tags: ['users', `user-${userId}`], // Multiple tags for fine-grained control
    },
  })

  if (!response.ok) {
    throw new Error('Failed to fetch user')
  }

  const data: ApiResponse<User> = await response.json()
  const user = data.data

  return (
    <div>
      <div className="mb-4 flex items-center gap-2">
        <Badge variant="secondary">Cached with revalidate: 120s</Badge>
        <Badge variant="outline">Tags: users, user-{userId}</Badge>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {user.name}
            <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
              {user.role}
            </Badge>
          </CardTitle>
          <CardDescription>{user.email}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-6 items-center">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
              <span className="text-3xl text-white font-bold">
                {user.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <div className="flex-1">
              <dl className="space-y-2 text-sm">
                <div>
                  <dt className="text-muted-foreground">Role</dt>
                  <dd className="font-medium capitalize">{user.role}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Member Since</dt>
                  <dd className="font-medium">
                    {new Date(user.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
