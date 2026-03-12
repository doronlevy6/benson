import { Box, Typography } from '@mui/material'
import SectionWrapper from '../components/layout/SectionWrapper'
import SectionTitle from '../components/ui/SectionTitle'
import { galleryItems } from '../data/siteContent'

function GallerySection() {
  return (
    <SectionWrapper id="gallery">
      <SectionTitle
        eyebrow="Gallery"
        title="Progress In Every Phase"
        description="Visual placeholders for current and upcoming project photos. You can replace these blocks with real site images at any time."
      />

      <Box
        sx={{
          display: 'grid',
          gap: 1.5,
          gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
        }}
      >
        {galleryItems.map((item) => (
          <Box
            key={item.title}
            sx={{
              minHeight: { xs: 150, sm: 190 },
              borderRadius: 3,
              background: item.gradient,
              border: '1px solid rgba(31, 42, 55, 0.2)',
              display: 'flex',
              alignItems: 'flex-end',
              p: 2,
              color: 'white',
            }}
          >
            <Typography variant="subtitle2" sx={{ letterSpacing: 0.3 }}>
              {item.title}
            </Typography>
          </Box>
        ))}
      </Box>
    </SectionWrapper>
  )
}

export default GallerySection
