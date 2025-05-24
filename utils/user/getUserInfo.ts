// utils/supabase/userInfo.ts
import { unstable_cache } from 'next/cache';
import { createClient } from "@/utils/supabase/server"
import { User } from '@supabase/supabase-js';

// Type pour les informations utilisateur
export interface UserInfo {
  email: string | null;
  id: string | null;
  name: string;
  avatarUrl: string;
  role: string;
  function: string;
  userPId: string | null;
  orgName: string;
  orgId: string | null;
  orgSlug: string | null;
  orgLogo: string | null;
  groupIds: string[];
}

/**
 * Fonction pure de transformation des données utilisateur
 */
function transformUserData(user: User): UserInfo {
  return {
    email: user.email || null,
    id: user.id || null,
    name: user.user_metadata?.name || user.email?.split("@")[0],
    avatarUrl: user.user_metadata?.avatar_url || "/default-avatar.png",
    role: user.user_metadata?.role || "TEACHER",
    function: user.user_metadata?.function || "TEACHER",
    userPId: user.user_metadata?.prisma_user_id || null,
    orgName: user?.user_metadata?.organization || "Organization",
    orgId: user.user_metadata?.orgId || null,
    orgSlug: user.user_metadata?.orgSlug || null,
    orgLogo: user.user_metadata?.orgLogo || null,
    groupIds: user.user_metadata?.groupIds || []
  };
}

// Déclaration unique de la fonction mise en cache
const getCachedUserInfo = unstable_cache(
  async (user: User): Promise<UserInfo | null> => {
    if (!user) return null;
    return transformUserData(user);
  },
  ['user-info', 'user'], // Clé de cache générique
  {
    revalidate: 1800, // Revalide le cache toutes les 30 minutes
    tags: ['user-data']
  }
);

/**
 * Fonction principale pour récupérer les informations utilisateur
 */
export async function getUserInfo(): Promise<UserInfo | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return null;
  
  // Utilisation de l'ID utilisateur comme partie de la clé de cache
  return unstable_cache(
    async () => getCachedUserInfo(user),
    ['user-info', user.id], // Clé de cache spécifique à l'utilisateur
    {
      revalidate: 1800,
      tags: ['user-data']
    }
  )();
}

/**
 * Fonction pour invalider manuellement le cache utilisateur
 */
export async function invalidateUserCache(): Promise<void> {
  const { revalidateTag } = await import('next/cache');
  revalidateTag('user-data');
}