
import { MarketingLayout } from '@/layouts/Marketing'
import { Container } from '@/primitives/Container'
import { Button, LinkButton } from '@/primitives/Button'
import { SignInIcon } from '@/icons'
import styles from '@/app/page.module.css'

export default function HomePage() {
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
          <LinkButton href="/signin">
            <SignInIcon />
            Sign in
          </LinkButton>
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
