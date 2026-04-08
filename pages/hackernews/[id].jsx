import Head from 'next/head'
import Link from 'next/link'
import { fetchItem, sanitizeStory, fetchCommentsWithReplies, formatRelativeTime } from '../../lib/hackernews'
import styles from './hackernews.module.sass'

function Comment({ comment }) {
  const isDeleted = comment.text === '[deleted]'

  return (
    <div className={styles.comment}>
      <div className={styles.commentMeta}>
        <span>{comment.by || 'unknown'}</span>
        {' · '}
        <span>{comment.timeAgo}</span>
      </div>
      <div
        className={`${styles.commentText}${isDeleted ? ` ${styles.deleted}` : ''}`}
        dangerouslySetInnerHTML={{ __html: comment.text }}
      />
      {comment.replies && comment.replies.length > 0 && (
        <div className={styles.commentReply}>
          {comment.replies.map((reply) => (
            <Comment key={reply.id} comment={reply} />
          ))}
        </div>
      )}
    </div>
  )
}

export default function StoryDetail({ story, comments }) {
  return (
    <div className={styles.container}>
      <Head>
        <title>{story.title}</title>
      </Head>

      <Link href="/hackernews" className={styles.backLink}>
        ← Back to Hacker News
      </Link>

      <div className={styles.storyHeader}>
        <h1 className={styles.storyTitle}>
          {story.url ? (
            <a href={story.url} target="_blank" rel="noopener noreferrer">
              {story.title}
            </a>
          ) : (
            story.title
          )}
        </h1>
        <div className={styles.storyMeta}>
          {story.score} points by {story.by} · {story.timeAgo} · {story.descendants} comments
        </div>
      </div>

      {story.text && (
        <div
          className={styles.storyText}
          dangerouslySetInnerHTML={{ __html: story.text }}
        />
      )}

      <div className={styles.commentsSection}>
        <h2 className={styles.commentsHeading}>Comments ({comments.length})</h2>
        {comments.length > 0 ? (
          comments.map((comment) => (
            <Comment key={comment.id} comment={comment} />
          ))
        ) : (
          <p className={styles.noComments}>No comments yet.</p>
        )}
      </div>
    </div>
  )
}

function addTimeAgoToComments(comments) {
  return comments.map((comment) => ({
    ...comment,
    timeAgo: formatRelativeTime(comment.time),
    replies: comment.replies ? addTimeAgoToComments(comment.replies) : [],
  }))
}

export async function getServerSideProps(context) {
  const { id } = context.params
  const rawStory = await fetchItem(id)

  if (!rawStory) {
    return { notFound: true }
  }

  const story = sanitizeStory(rawStory)
  story.timeAgo = formatRelativeTime(story.time)
  let comments = []

  if (story.kids && story.kids.length > 0) {
    comments = await fetchCommentsWithReplies(story.kids, 1)
    comments = addTimeAgoToComments(comments)
  }

  return {
    props: {
      story,
      comments,
    },
  }
}
