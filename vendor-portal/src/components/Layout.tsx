import React, { useState } from 'react';
import {
  AppBar,
  Box,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Avatar,
  Chip,
  Badge,
  Menu,
  MenuItem,
  Tooltip,
  alpha,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Person as PersonIcon,
  Description as DocumentIcon,
  ShoppingCart as POIcon,
  Receipt as InvoiceIcon,
  Payment as PaymentIcon,
  Help as SupportIcon,
  ExitToApp as LogoutIcon,
  Notifications as NotificationsIcon,
  Business as BusinessIcon,
  CheckCircle as CheckCircleIcon,
  SwapHoriz as SwapIcon,
  ExpandMore as ExpandMoreIcon,
  Schedule as PendingIcon,
  Explore as ExploreIcon,
} from '@mui/icons-material';
import { useLocation } from 'wouter';

const drawerWidth = 260;

interface Props {
  children: React.ReactNode;
}

interface Company {
  id: number;
  name: string;
  shortName: string;
  vendorCode: string;
  role: string;
  status: 'Approved' | 'Pending' | 'Under Review';
  initials: string;
  color: string;
  since: string;
}

const COMPANIES: Company[] = [
  {
    id: 1,
    name: 'Acme Corporation',
    shortName: 'Acme Corp',
    vendorCode: 'VND-ACM-0041',
    role: 'IT Services Vendor',
    status: 'Approved',
    initials: 'AC',
    color: '#1A4B8C',
    since: 'Jan 2024',
  },
  {
    id: 2,
    name: 'TechGiant Industries',
    shortName: 'TechGiant',
    vendorCode: 'VND-TGI-0117',
    role: 'Software Solutions Vendor',
    status: 'Approved',
    initials: 'TG',
    color: '#00897B',
    since: 'Mar 2025',
  },
  {
    id: 3,
    name: 'GlobalMart Ltd',
    shortName: 'GlobalMart',
    vendorCode: 'VND-GML-0008',
    role: 'Managed Services Vendor',
    status: 'Pending',
    initials: 'GM',
    color: '#F57C00',
    since: 'Jun 2026',
  },
];

const MENU_ITEMS = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
  { text: 'Profile', icon: <PersonIcon />, path: '/profile' },
  { text: 'Documents', icon: <DocumentIcon />, path: '/documents' },
  { text: 'Contracts', icon: <DocumentIcon />, path: '/contracts' },
  { text: 'Purchase Orders', icon: <POIcon />, path: '/purchase-orders' },
  { text: 'Invoices', icon: <InvoiceIcon />, path: '/invoices' },
  { text: 'Payments', icon: <PaymentIcon />, path: '/payments' },
  { text: 'Support', icon: <SupportIcon />, path: '/support' },
  { text: 'Company Directory', icon: <ExploreIcon />, path: '/company-directory', dividerBefore: true },
];

export default function Layout({ children }: Props) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [location, setLocation] = useLocation();
  const [activeCompany, setActiveCompany] = useState<Company>(COMPANIES[0]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  const handleNavigation = (path: string) => {
    setLocation(path);
    if (isMobile) setMobileOpen(false);
  };

  const handleLogout = () => setLocation('/login');

  const handleCompanyMenuOpen = (e: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget);
  };

  const handleCompanyMenuClose = () => setAnchorEl(null);

  const handleCompanySwitch = (company: Company) => {
    setActiveCompany(company);
    handleCompanyMenuClose();
  };

  const statusColor = (status: Company['status']) => {
    if (status === 'Approved') return 'success';
    if (status === 'Pending') return 'warning';
    return 'info';
  };

  const drawer = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Sidebar header */}
      <Toolbar sx={{ px: 2, height: 64, alignItems: 'center' }}>
        <Typography variant="h6" sx={{ fontWeight: 700, color: theme.palette.primary.main }}>
          VMS Portal
        </Typography>
      </Toolbar>
      <Divider />

      {/* Vendor identity card in sidebar */}
      <Box
        sx={{
          mx: 2,
          mt: 2,
          mb: 1,
          p: 1.5,
          borderRadius: 2,
          bgcolor: alpha(theme.palette.primary.main, 0.06),
          border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
        }}
      >
        <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ textTransform: 'uppercase', letterSpacing: '0.4px' }}>
          Signed in as
        </Typography>
        <Typography variant="body2" fontWeight={700} sx={{ mt: 0.25 }}>
          Nexus Solutions Pvt Ltd
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {activeCompany.vendorCode} · {activeCompany.role}
        </Typography>
      </Box>

      {/* Nav items */}
      <List sx={{ px: 2, py: 1, display: 'flex', flexDirection: 'column', gap: 0.25, flex: 1 }}>
        {MENU_ITEMS.map((item) => {
          const isActive = location === item.path;
          return (
            <React.Fragment key={item.text}>
              {item.dividerBefore && <Divider sx={{ my: 1 }} />}
            <ListItem disablePadding>
              <ListItemButton
                selected={isActive}
                onClick={() => handleNavigation(item.path)}
                data-testid={`nav-${item.text.toLowerCase().replace(/\s+/g, '-')}`}
                sx={{
                  borderRadius: 2,
                  '&.Mui-selected': {
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    color: theme.palette.primary.main,
                    '& .MuiListItemIcon-root': { color: theme.palette.primary.main },
                  },
                  '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.05) },
                }}
              >
                <ListItemIcon sx={{ minWidth: 40, color: isActive ? theme.palette.primary.main : theme.palette.text.secondary }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontSize: 14,
                    fontWeight: isActive ? 700 : 500,
                    color: isActive ? theme.palette.primary.main : theme.palette.text.primary,
                  }}
                />
              </ListItemButton>
            </ListItem>
            </React.Fragment>
          );
        })}
      </List>

      {/* Logout */}
      <Box sx={{ px: 2, pb: 2 }}>
        <Divider sx={{ mb: 1.5 }} />
        <ListItemButton onClick={handleLogout} sx={{ borderRadius: 2 }} data-testid="nav-logout">
          <ListItemIcon sx={{ minWidth: 40, color: theme.palette.text.secondary }}>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText
            primary="Logout"
            primaryTypographyProps={{ fontSize: 14, fontWeight: 500, color: theme.palette.text.primary }}
          />
        </ListItemButton>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <CssBaseline />

      {/* AppBar */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          bgcolor: 'background.paper',
          borderBottom: `1px solid ${theme.palette.divider}`,
          color: 'text.primary',
        }}
      >
        <Toolbar sx={{ height: 64, justifyContent: 'space-between' }}>
          {/* Left: hamburger + company switcher */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, overflow: 'hidden' }}>
            <IconButton
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ display: { md: 'none' }, mr: 0.5 }}
              data-testid="btn-drawer-toggle"
            >
              <MenuIcon />
            </IconButton>

            {/* Company Switcher Button */}
            <Tooltip title="Switch company">
              <Box
                onClick={handleCompanyMenuOpen}
                data-testid="btn-company-switcher"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  px: 1.5,
                  py: 0.75,
                  borderRadius: 2,
                  cursor: 'pointer',
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.15)}`,
                  bgcolor: anchorEl ? alpha(theme.palette.primary.main, 0.06) : 'transparent',
                  transition: 'background-color 0.15s ease',
                  '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.06) },
                  maxWidth: { xs: 180, sm: 320 },
                  overflow: 'hidden',
                }}
              >
                <Avatar
                  sx={{
                    width: 28,
                    height: 28,
                    fontSize: 11,
                    fontWeight: 700,
                    bgcolor: activeCompany.color,
                    flexShrink: 0,
                  }}
                >
                  {activeCompany.initials}
                </Avatar>
                <Box sx={{ minWidth: 0, display: { xs: 'none', sm: 'block' } }}>
                  <Typography variant="body2" fontWeight={700} noWrap>
                    {activeCompany.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" noWrap sx={{ lineHeight: 1.2, display: 'block' }}>
                    {activeCompany.role}
                  </Typography>
                </Box>
                <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', gap: 0.5, flexShrink: 0 }}>
                  <Chip
                    label={activeCompany.status}
                    size="small"
                    color={statusColor(activeCompany.status)}
                    sx={{ height: 20, fontSize: '0.65rem', fontWeight: 700, px: 0.25 }}
                  />
                </Box>
                <ExpandMoreIcon
                  sx={{
                    fontSize: 18,
                    color: 'text.secondary',
                    flexShrink: 0,
                    transform: anchorEl ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s ease',
                  }}
                />
              </Box>
            </Tooltip>
          </Box>

          {/* Right: notifications + avatar */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexShrink: 0 }}>
            <IconButton data-testid="btn-notifications">
              <Badge badgeContent={3} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <Avatar
              sx={{ bgcolor: theme.palette.primary.main, width: 36, height: 36, fontSize: 13, fontWeight: 700 }}
            >
              NS
            </Avatar>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Company Switcher Dropdown Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCompanyMenuClose}
        transformOrigin={{ horizontal: 'left', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
        PaperProps={{
          sx: {
            mt: 0.5,
            minWidth: 320,
            borderRadius: 2,
            border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
            boxShadow: '0 8px 32px rgba(26,75,140,0.15)',
            overflow: 'visible',
          },
        }}
      >
        {/* Header */}
        <Box sx={{ px: 2, pt: 2, pb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
            <BusinessIcon sx={{ fontSize: 18, color: 'primary.main' }} />
            <Typography variant="subtitle2" fontWeight={700}>
              Connected Companies
            </Typography>
          </Box>
          <Typography variant="caption" color="text.secondary">
            Nexus Solutions Pvt Ltd is registered with {COMPANIES.length} buyer companies.
          </Typography>
        </Box>
        <Divider sx={{ mx: 2, mb: 0.5 }} />

        {/* Company list */}
        {COMPANIES.map((company) => {
          const isActive = activeCompany.id === company.id;
          return (
            <MenuItem
              key={company.id}
              onClick={() => handleCompanySwitch(company)}
              data-testid={`company-option-${company.id}`}
              sx={{
                mx: 1,
                mb: 0.5,
                borderRadius: 2,
                px: 1.5,
                py: 1.25,
                alignItems: 'flex-start',
                bgcolor: isActive ? alpha(theme.palette.primary.main, 0.07) : 'transparent',
                border: isActive ? `1px solid ${alpha(theme.palette.primary.main, 0.15)}` : '1px solid transparent',
                '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.05) },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, width: '100%' }}>
                {/* Company avatar */}
                <Avatar
                  sx={{
                    width: 40,
                    height: 40,
                    fontSize: 13,
                    fontWeight: 700,
                    bgcolor: company.color,
                    flexShrink: 0,
                  }}
                >
                  {company.initials}
                </Avatar>

                {/* Company info */}
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                    <Typography variant="body2" fontWeight={700} noWrap>
                      {company.name}
                    </Typography>
                    {isActive && (
                      <CheckCircleIcon sx={{ fontSize: 15, color: theme.palette.primary.main, flexShrink: 0 }} />
                    )}
                  </Box>
                  <Typography variant="caption" color="text.secondary" display="block">
                    {company.role} · Since {company.since}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" display="block">
                    {company.vendorCode}
                  </Typography>
                </Box>

                {/* Status */}
                <Box sx={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 0.5 }}>
                  <Chip
                    label={company.status}
                    size="small"
                    color={statusColor(company.status)}
                    icon={
                      company.status === 'Approved'
                        ? <CheckCircleIcon sx={{ fontSize: '13px !important' }} />
                        : <PendingIcon sx={{ fontSize: '13px !important' }} />
                    }
                    sx={{ height: 22, fontSize: '0.65rem', fontWeight: 700 }}
                  />
                  {isActive && (
                    <Typography variant="caption" color="primary.main" fontWeight={600}>
                      Active
                    </Typography>
                  )}
                </Box>
              </Box>
            </MenuItem>
          );
        })}

        {/* Footer */}
        <Divider sx={{ mx: 2, mt: 0.5 }} />
        <Box sx={{ px: 2, py: 1.25, display: 'flex', alignItems: 'center', gap: 0.75 }}>
          <SwapIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
          <Typography variant="caption" color="text.secondary">
            Click any company to switch your working context.
          </Typography>
        </Box>
      </Menu>

      {/* Sidebar */}
      <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              borderRight: `1px solid ${theme.palette.divider}`,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main content */}
      <Box
        component="main"
        sx={{ flexGrow: 1, p: { xs: 2, md: 4 }, width: { md: `calc(100% - ${drawerWidth}px)` }, mt: '64px' }}
      >
        {children}
      </Box>
    </Box>
  );
}
