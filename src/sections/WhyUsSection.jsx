import { Box } from '@mui/material'
import SectionWrapper from '../components/layout/SectionWrapper'
import InfoCard from '../components/ui/InfoCard'
import SectionTitle from '../components/ui/SectionTitle'
import { whyUsPoints } from '../data/siteContent'

function WhyUsSection() {
  return (
    <SectionWrapper id="why-us" background="rgba(255, 255, 255, 0.74)">
      <SectionTitle
        eyebrow="Why Us"
        title="A Practical Partner For Serious Builds"
        description="We keep execution predictable with strong process control, on-site discipline, and clear accountability."
      />

      <Box
        sx={{
          display: 'grid',
          gap: 2,
          gridTemplateColumns: { xs: '1fr', md: 'repeat(3, minmax(0, 1fr))' },
        }}
      >
        {whyUsPoints.map((item) => (
          <InfoCard key={item.title} title={item.title} description={item.description} />
        ))}
      </Box>
    </SectionWrapper>
  )
}

export default WhyUsSection
