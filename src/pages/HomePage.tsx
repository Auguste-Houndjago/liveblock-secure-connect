
import { useAuth } from '@/hooks/useAuth'
import { MarketingLayout } from '@/layouts/Marketing'
import { Container } from '@/primitives/Container'
import { Button, LinkButton } from '@/primitives/Button'
import { SignInIcon, SignOutIcon } from '@/icons'
import styles from '@/app/page.module.css'

export default function HomePage() {
  const { user, signOut, loading } = useAuth()

  if (loading) {
    return (
      <MarketingLayout>
        <Container className={styles.section}>
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="text-lg">Loading...</div>
          </div>
        </Container>
      </MarketingLayout>
    )
  }

  return (
    <MarketingLayout>
      <Container className={styles.section}>
        <div className={styles.heroInfo}>
          <h1 className={styles.heroTitle}>
            Kickstart your collaborative&nbsp;app
          </h1>
          <p className={styles.heroLead}>
            Use the Liveblocks Starter Kit to build your document-based
            collaborative app in&nbsp;minutes.
          </p>
        </div>
        <div className={styles.heroActions}>
          {user ? (
            <div className="flex flex-col items-center gap-4">
              <p className="text-sm text-gray-600">
                Welcome, {user.email}!
              </p>
              <Button onClick={signOut}>
                <SignOutIcon />
                Sign out
              </Button>
            </div>
          ) : (
            <LinkButton href="/signin">
              <SignInIcon />
              Sign in
            </LinkButton>
          )}
          <LinkButton
            href="https://liveblocks.io/docs/guides/nextjs-starter-kit"
            target="_blank"
            variant="secondary"
          >
            Learn more
          </LinkButton>
        </div>
      </Container>
    </MarketingLayout>
  )
}
