import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward'
import HandshakeIcon from '@mui/icons-material/Handshake'
import { Box, Button, Stack, Typography } from '@mui/material'
import SectionWrapper from '../components/layout/SectionWrapper'
import { heroMetrics } from '../data/siteContent'

function HomeSection({ onNavigate }) {
  return (
    <SectionWrapper id="home">
      <Box
        sx={{
          borderRadius: 4,
          p: { xs: 3, md: 5 },
          border: '1px solid rgba(31, 42, 55, 0.2)',
          background:
            'linear-gradient(140deg, rgba(31, 42, 55, 0.95) 0%, rgba(47, 63, 82, 0.97) 55%, rgba(196, 138, 59, 0.22) 120%)',
          color: 'white',
          boxShadow: '0 24px 40px rgba(17, 24, 39, 0.25)',
        }}
      >
        <Box
          sx={{
            display: 'grid',
            gap: 3,
            gridTemplateColumns: { xs: '1fr', md: '1.4fr 1fr' },
            alignItems: 'center',
          }}
        >
          <Stack spacing={2}>
            <Typography variant="h1" sx={{ fontSize: { xs: '2rem', md: '3.2rem' }, lineHeight: 1 }}>
              Build With Confidence
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 500, color: 'rgba(255, 255, 255, 0.82)' }}>
              Benson delivers reliable construction with disciplined planning, quality execution,
              and transparent communication.
            </Typography>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
              <Button
                size="large"
                variant="contained"
                color="secondary"
                endIcon={<ArrowOutwardIcon />}
                onClick={() => onNavigate('projects')}
              >
                View Projects
              </Button>
              <Button
                size="large"
                variant="outlined"
                onClick={() => onNavigate('contact')}
                sx={{
                  color: 'white',
                  borderColor: 'rgba(255, 255, 255, 0.55)',
                  '&:hover': {
                    borderColor: 'secondary.light',
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  },
                }}
              >
                Request A Consultation
              </Button>
            </Stack>
          </Stack>

          <Box
            sx={{
              p: 3,
              borderRadius: 3,
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}
          >
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
              <HandshakeIcon sx={{ color: 'secondary.light' }} />
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                Trusted Build Partner
              </Typography>
            </Stack>
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
              We align schedule, budget, and workmanship so your project reaches handover without
              avoidable surprises.
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            mt: { xs: 3, md: 4 },
            display: 'grid',
            gap: 1.25,
            gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(3, 1fr)' },
          }}
        >
          {heroMetrics.map((metric) => (
            <Box
              key={metric.label}
              sx={{
                p: 2,
                borderRadius: 2.5,
                border: '1px solid rgba(255, 255, 255, 0.22)',
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
              }}
            >
              <Typography variant="h4" sx={{ fontFamily: '"Oswald", "Heebo", sans-serif' }}>
                {metric.value}
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                {metric.label}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </SectionWrapper>
  )
}

export default HomeSection
