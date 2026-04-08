import Head from 'next/head'
import Link from 'next/link'
import { fetchTopStories, formatRelativeTime } from '../../lib/hackernews'
import styles from './hackernews.module.sass'

export default function HackerNewsIndex({ stories }) {
  return (
    <div className={styles.container}>
      <Head>
        <title>Hacker News - Trending Topics</title>
      </Head>

      <div className={styles.header}>
        <h1 className={styles.pageTitle}>Hacker News - Trending Topics</h1>
        <Link href="/" className={styles.backLink}>
          Back to Home
        </Link>
      </div>

      {!stories || stories.length === 0 ? (
        <p className={styles.emptyState}>
          No trending stories available. Please try again later.
        </p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.tableHeader}>#</th>
              <th className={styles.tableHeader}>Title</th>
              <th className={styles.tableHeader}>Author</th>
              <th className={styles.tableHeader}>Score</th>
              <th className={styles.tableHeader}>Comments</th>
              <th className={styles.tableHeader}>Time</th>
            </tr>
          </thead>
          <tbody>
            {stories.map((story, index) => (
              <tr key={story.id} className={styles.tableRow}>
                <td className={styles.tableCell}>{index + 1}</td>
                <td className={styles.tableCell}>
                  <Link href={`/hackernews/${story.id}`} className={styles.titleLink}>
                    {story.title}
                  </Link>
                  {story.url && (
                    <a
                      href={story.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.externalLink}
                    >
                      ↗
                    </a>
                  )}
                </td>
                <td className={styles.tableCell}>{story.by}</td>
                <td className={styles.tableCell}>{story.score}</td>
                <td className={styles.tableCell}>{story.descendants}</td>
                <td className={styles.tableCell}>{story.timeAgo}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export async function getServerSideProps() {
  const stories = await fetchTopStories(10)
  const storiesWithTimeAgo = stories.map((story) => ({
    ...story,
    timeAgo: formatRelativeTime(story.time),
  }))
  return { props: { stories: storiesWithTimeAgo } }
}
