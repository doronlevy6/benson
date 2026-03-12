export const statusOptions = [
  { id: 'not_started', label: 'לא התחילו' },
  { id: 'in_progress', label: 'בתהליך' },
  { id: 'completed', label: 'סיימו' },
]

export const statusIdToLabel = Object.fromEntries(
  statusOptions.map((status) => [status.id, status.label]),
)

export const statusAliases = {
  לא_התחילו: 'not_started',
  לא_התחיל: 'not_started',
  לא_בוצע: 'not_started',
  בתהליך: 'in_progress',
  בביצוע: 'in_progress',
  בעבודה: 'in_progress',
  הושלם: 'completed',
  סיימו: 'completed',
  הסתיים: 'completed',
  בוצע: 'completed',
}
