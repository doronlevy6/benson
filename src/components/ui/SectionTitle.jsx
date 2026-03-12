import { Stack, Typography } from '@mui/material'

function SectionTitle({ eyebrow, title, description, align = 'left' }) {
  return (
    <Stack spacing={1.25} sx={{ mb: { xs: 3, md: 4 }, textAlign: align }}>
      {eyebrow ? (
        <Typography
          variant="caption"
          sx={{
            color: 'secondary.dark',
            fontWeight: 700,
            letterSpacing: 1.2,
            textTransform: 'uppercase',
          }}
        >
          {eyebrow}
        </Typography>
      ) : null}

      <Typography variant="h2" sx={{ fontSize: { xs: '1.75rem', md: '2.35rem' }, lineHeight: 1.15 }}>
        {title}
      </Typography>

      {description ? (
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 760, mx: align === 'center' ? 'auto' : 0 }}>
          {description}
        </Typography>
      ) : null}
    </Stack>
  )
}

export default SectionTitle
