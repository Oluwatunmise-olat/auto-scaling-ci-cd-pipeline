import dayjs from 'dayjs'

export const formatDate = (format: string, date: string | null = null) => {
	date = (!date ? dayjs() : date) as string

	return dayjs(date).format(format)
}
