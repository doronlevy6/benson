import SendRoundedIcon from '@mui/icons-material/SendRounded'
import {
  Box,
  Button,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import SectionWrapper from '../components/layout/SectionWrapper'
import SectionTitle from '../components/ui/SectionTitle'
import { contactDetails } from '../data/siteContent'

function ContactSection() {
  const handleSubmit = (event) => {
    event.preventDefault()
  }

  return (
    <SectionWrapper id="contact">
      <SectionTitle
        eyebrow="Contact"
        title="Let&apos;s Discuss Your Project"
        description="Share your timeline and project scope. Benson will get back with a practical next-step plan."
      />

      <Box
        sx={{
          display: 'grid',
          gap: 2,
          gridTemplateColumns: { xs: '1fr', md: '1fr 1.2fr' },
        }}
      >
        <Stack spacing={1.5}>
          {contactDetails.map((item) => (
            <Box
              key={item.label}
              sx={{
                p: 2,
                borderRadius: 2,
                border: '1px solid rgba(31, 42, 55, 0.14)',
                backgroundColor: 'white',
              }}
            >
              <Typography variant="caption" sx={{ color: 'secondary.dark', fontWeight: 700 }}>
                {item.label}
              </Typography>
              <Typography variant="body1">{item.value}</Typography>
            </Box>
          ))}
        </Stack>

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            p: { xs: 2.5, md: 3 },
            borderRadius: 2,
            border: '1px solid rgba(31, 42, 55, 0.14)',
            backgroundColor: 'white',
          }}
        >
          <Stack spacing={1.5}>
            <TextField label="Full Name" size="small" fullWidth />
            <TextField label="Email" type="email" size="small" fullWidth />
            <TextField label="Phone" size="small" fullWidth />
            <TextField label="Project Details" multiline minRows={4} fullWidth />
            <Button type="submit" variant="contained" endIcon={<SendRoundedIcon />}>
              Send Inquiry
            </Button>
            <Typography variant="caption" color="text.secondary">
              Phase 1 demo: connect this form to email or CRM in the next step.
            </Typography>
          </Stack>
        </Box>
      </Box>
    </SectionWrapper>
  )
}

export default ContactSection
