import { Card, CardContent, Stack, Typography } from '@mui/material'

function InfoCard({ title, subtitle, description, footer }) {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ p: { xs: 2.5, md: 3 }, height: '100%' }}>
        <Stack spacing={1.25} sx={{ height: '100%' }}>
          {subtitle ? (
            <Typography variant="overline" sx={{ color: 'secondary.dark', fontWeight: 700 }}>
              {subtitle}
            </Typography>
          ) : null}

          <Typography variant="h3" sx={{ fontSize: { xs: '1.2rem', md: '1.3rem' } }}>
            {title}
          </Typography>

          {description ? (
            <Typography variant="body2" color="text.secondary" sx={{ flexGrow: 1 }}>
              {description}
            </Typography>
          ) : null}

          {footer ? (
            <Typography variant="caption" sx={{ color: 'primary.dark', fontWeight: 600 }}>
              {footer}
            </Typography>
          ) : null}
        </Stack>
      </CardContent>
    </Card>
  )
}

export default InfoCard
