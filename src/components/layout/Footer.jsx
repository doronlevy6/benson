import { Box, Button, Container, Stack, Typography } from '@mui/material'

function Footer({ navigationItems, onNavigate }) {
  return (
    <Box component="footer" sx={{ borderTop: '1px solid rgba(31, 42, 55, 0.15)', py: 4 }}>
      <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 } }}>
        <Stack spacing={2.5}>
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={1}
            alignItems={{ xs: 'flex-start', md: 'center' }}
            justifyContent="space-between"
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              BENSON CONSTRUCTION
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Built with precision, delivered with trust.
            </Typography>
          </Stack>

          <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
            {navigationItems.map((item) => (
              <Button
                key={item.id}
                variant="text"
                size="small"
                onClick={() => onNavigate(item.id)}
              >
                {item.label}
              </Button>
            ))}
          </Stack>

          <Typography variant="caption" color="text.secondary">
            {new Date().getFullYear()} Benson. All rights reserved.
          </Typography>
        </Stack>
      </Container>
    </Box>
  )
}

export default Footer
