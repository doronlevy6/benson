import ConstructionIcon from '@mui/icons-material/Construction'
import PhoneIcon from '@mui/icons-material/Phone'
import {
  AppBar,
  Box,
  Button,
  Container,
  Tab,
  Tabs,
  Toolbar,
  Typography,
} from '@mui/material'

function Header({ activeSection, navigationItems, onNavigate }) {
  return (
    <AppBar
      position="sticky"
      elevation={0}
      color="transparent"
      sx={{
        borderBottom: '1px solid rgba(31, 42, 55, 0.16)',
        backdropFilter: 'blur(8px)',
        backgroundColor: 'rgba(238, 241, 243, 0.92)',
      }}
    >
      <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 } }}>
        <Toolbar disableGutters sx={{ minHeight: { xs: 62, md: 70 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, flexGrow: 1 }}>
            <Box
              sx={{
                width: 34,
                height: 34,
                borderRadius: '50%',
                display: 'grid',
                placeItems: 'center',
                color: 'secondary.main',
                border: '1px solid rgba(196, 138, 59, 0.35)',
                backgroundColor: 'rgba(196, 138, 59, 0.1)',
              }}
            >
              <ConstructionIcon fontSize="small" />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 600, letterSpacing: 0.6 }}>
              BENSON
            </Typography>
          </Box>

          <Button
            variant="contained"
            color="primary"
            size="small"
            startIcon={<PhoneIcon />}
            onClick={() => onNavigate('contact')}
            sx={{ display: { xs: 'none', sm: 'inline-flex' } }}
          >
            Let&apos;s Talk
          </Button>
        </Toolbar>
      </Container>

      <Box sx={{ borderTop: '1px solid rgba(31, 42, 55, 0.12)' }}>
        <Container maxWidth="lg" sx={{ px: { xs: 0, sm: 2 } }}>
          <Tabs
            value={activeSection}
            onChange={(_, value) => onNavigate(value)}
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            textColor="primary"
            indicatorColor="secondary"
            sx={{
              minHeight: 52,
              '& .MuiTabs-flexContainer': {
                gap: { xs: 0.25, sm: 0.5 },
              },
            }}
          >
            {navigationItems.map((item) => (
              <Tab
                key={item.id}
                value={item.id}
                label={item.label}
                sx={{
                  textTransform: 'none',
                  minHeight: 52,
                  fontSize: { xs: '0.9rem', sm: '0.95rem' },
                }}
              />
            ))}
          </Tabs>
        </Container>
      </Box>
    </AppBar>
  )
}

export default Header
