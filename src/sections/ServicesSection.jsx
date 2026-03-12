import { Box } from '@mui/material'
import SectionWrapper from '../components/layout/SectionWrapper'
import InfoCard from '../components/ui/InfoCard'
import SectionTitle from '../components/ui/SectionTitle'
import { services } from '../data/siteContent'

function ServicesSection() {
  return (
    <SectionWrapper id="services" background="rgba(255, 255, 255, 0.74)">
      <SectionTitle
        eyebrow="Services"
        title="What We Build"
        description="Integrated services that cover the full build lifecycle, from planning through final delivery."
      />

      <Box
        sx={{
          display: 'grid',
          gap: 2,
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))' },
        }}
      >
        {services.map((service) => (
          <InfoCard key={service.title} title={service.title} description={service.description} />
        ))}
      </Box>
    </SectionWrapper>
  )
}

export default ServicesSection
