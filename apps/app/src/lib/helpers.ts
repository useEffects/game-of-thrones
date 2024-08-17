import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'

TimeAgo.addLocale(en)

export const timeAgo = new TimeAgo('en-US')

export function SortMessagesReverse(a: { createdAt: number }, b: { createdAt: number }) {
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
}