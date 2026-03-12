import { Box, Container } from '@mui/material'

function SectionWrapper({ id, background = 'transparent', children }) {
  return (
    <Box
      component="section"
      id={id}
      sx={{
        py: { xs: 7, md: 10 },
        scrollMarginTop: { xs: '128px', md: '144px' },
        background,
      }}
    >
      <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 } }}>
        {children}
      </Container>
    </Box>
  )
}

export default SectionWrapper
