import GppGoodIcon from '@mui/icons-material/GppGood'
import { Box, Stack, Typography } from '@mui/material'
import SectionWrapper from '../components/layout/SectionWrapper'
import SectionTitle from '../components/ui/SectionTitle'
import { aboutText } from '../data/siteContent'

const values = [
  'Structured planning from pre-construction to handover',
  'Safety-led execution on every active site',
  'Consistent quality checks and material control',
  'Long-term relationships with clients and partners',
]

function AboutSection() {
  return (
    <SectionWrapper id="about" background="rgba(255, 255, 255, 0.72)">
      <SectionTitle
        eyebrow="About Benson"
        title="Professional Construction Backed By Process"
        description={aboutText}
      />

      <Box
        sx={{
          display: 'grid',
          gap: 2,
          gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
        }}
      >
        {values.map((value) => (
          <Stack
            key={value}
            direction="row"
            spacing={1.4}
            sx={{
              p: 2,
              borderRadius: 2,
              border: '1px solid rgba(31, 42, 55, 0.14)',
              backgroundColor: 'white',
            }}
          >
            <GppGoodIcon color="secondary" />
            <Typography variant="body1">{value}</Typography>
          </Stack>
        ))}
      </Box>
    </SectionWrapper>
  )
}

export default AboutSection
