import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  useTheme,
  alpha,
} from '@mui/material';
import {
  AccountBalanceWallet as WalletIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
} from 'recharts';

const monthlyData = [
  { month: 'Jan', amount: 0 },
  { month: 'Feb', amount: 70000 },
  { month: 'Mar', amount: 420000 },
  { month: 'Apr', amount: 930000 },
  { month: 'May', amount: 870000 },
  { month: 'Jun', amount: 360000 },
];

const MOCK_PAYMENTS = [
  { ref: 'PMT-2026-0031', invoice: 'INV-2026-0018', date: 'Jun 10, 2026', amount: 360000, method: 'Bank Transfer', status: 'Reconciled' },
  { ref: 'PMT-2026-0028', invoice: 'INV-2026-0019', date: 'May 28, 2026', amount: 690000, method: 'Bank Transfer', status: 'Reconciled' },
  { ref: 'PMT-2026-0025', invoice: 'INV-2026-0020', date: 'May 15, 2026', amount: 180000, method: 'Bank Transfer', status: 'Reconciled' },
  { ref: 'PMT-2026-0022', invoice: 'INV-2026-0015', date: 'Apr 30, 2026', amount: 420000, method: 'Bank Transfer', status: 'Reconciled' },
  { ref: 'PMT-2026-0019', invoice: 'INV-2026-0013', date: 'Apr 12, 2026', amount: 510000, method: 'Bank Transfer', status: 'Reconciled' },
  { ref: 'PMT-2026-0015', invoice: 'INV-2026-0011', date: 'Mar 28, 2026', amount: 240000, method: 'Bank Transfer', status: 'Reconciled' },
  { ref: 'PMT-2026-0012', invoice: 'INV-2026-0009', date: 'Mar 10, 2026', amount: 180000, method: 'Bank Transfer', status: 'Reconciled' },
  { ref: 'PMT-2026-0008', invoice: 'INV-2026-0007', date: 'Feb 22, 2026', amount: 70000, method: 'Bank Transfer', status: 'Reconciled' },
];

const formatAmount = (value: number) => {
  if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
  if (value >= 1000) return `₹${(value / 1000).toFixed(0)}K`;
  return `₹${value}`;
};

const formatFull = (value: number) =>
  `₹${value.toLocaleString('en-IN')}`;

const CustomBarTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <Paper sx={{ p: 1.5, border: '1px solid rgba(26,75,140,0.1)', minWidth: 130 }}>
        <Typography variant="caption" color="text.secondary" display="block">{label} 2026</Typography>
        <Typography variant="body2" fontWeight={700} color="secondary.main">
          {formatAmount(payload[0].value)}
        </Typography>
      </Paper>
    );
  }
  return null;
};

const avgPayment = monthlyData.filter((d) => d.amount > 0).reduce((s, d) => s + d.amount, 0) / monthlyData.filter((d) => d.amount > 0).length;

export default function Payments() {
  const theme = useTheme();

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" fontWeight={700}>Payments</Typography>
        <Typography variant="body2" color="text.secondary">
          Track historical remittance and expected payouts.
        </Typography>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={2.5} sx={{ mb: 3.5 }}>
        <Grid item xs={12} sm={4}>
          <Card
            sx={{
              background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
              color: 'white',
              border: 'none',
            }}
          >
            <CardContent sx={{ p: { xs: 2, md: 2.5 }, '&:last-child': { pb: { xs: 2, md: 2.5 } } }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                <Typography variant="caption" fontWeight={600} sx={{ color: alpha('#fff', 0.75), textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Total Received (YTD)
                </Typography>
                <WalletIcon sx={{ color: alpha('#fff', 0.5), fontSize: 24 }} />
              </Box>
              <Typography variant="h4" fontWeight={800} sx={{ color: 'white' }}>₹26.5L</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                <TrendingUpIcon sx={{ fontSize: 16, color: '#A5D6A7' }} />
                <Typography variant="caption" sx={{ color: '#A5D6A7', fontWeight: 600 }}>8 payments · Jan–Jun 2026</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Card
            sx={{
              background: `linear-gradient(135deg, ${theme.palette.secondary.dark} 0%, ${theme.palette.secondary.main} 100%)`,
              color: 'white',
              border: 'none',
            }}
          >
            <CardContent sx={{ p: { xs: 2, md: 2.5 }, '&:last-child': { pb: { xs: 2, md: 2.5 } } }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                <Typography variant="caption" fontWeight={600} sx={{ color: alpha('#fff', 0.75), textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Last Payment
                </Typography>
                <CheckCircleIcon sx={{ color: alpha('#fff', 0.5), fontSize: 24 }} />
              </Box>
              <Typography variant="h4" fontWeight={800} sx={{ color: 'white' }}>₹3.6L</Typography>
              <Typography variant="caption" sx={{ color: alpha('#fff', 0.75), fontWeight: 500 }}>Jun 10, 2026 · Bank Transfer</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Card
            sx={{
              background: `linear-gradient(135deg, #E65100 0%, #F57C00 100%)`,
              color: 'white',
              border: 'none',
            }}
          >
            <CardContent sx={{ p: { xs: 2, md: 2.5 }, '&:last-child': { pb: { xs: 2, md: 2.5 } } }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                <Typography variant="caption" fontWeight={600} sx={{ color: alpha('#fff', 0.75), textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Next Expected
                </Typography>
                <ScheduleIcon sx={{ color: alpha('#fff', 0.5), fontSize: 24 }} />
              </Box>
              <Typography variant="h4" fontWeight={800} sx={{ color: 'white' }}>₹6.4L</Typography>
              <Typography variant="caption" sx={{ color: alpha('#fff', 0.75), fontWeight: 500 }}>est. Jun 30, 2026</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Chart */}
      <Card sx={{ mb: 3.5 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2.5, flexWrap: 'wrap', gap: 1 }}>
            <Box>
              <Typography variant="h6" fontWeight={700}>Monthly Payment Inflows</Typography>
              <Typography variant="caption" color="text.secondary">
                Remittances received per month · 2026
              </Typography>
            </Box>
            <Chip
              label={`Avg: ${formatAmount(avgPayment)} / month`}
              size="small"
              sx={{ bgcolor: alpha(theme.palette.secondary.main, 0.1), color: 'secondary.main', fontWeight: 600 }}
            />
          </Box>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={monthlyData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }} barSize={36}>
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={theme.palette.secondary.main} stopOpacity={1} />
                  <stop offset="100%" stopColor={theme.palette.secondary.dark} stopOpacity={0.8} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={alpha(theme.palette.primary.main, 0.07)} vertical={false} />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 12, fill: theme.palette.text.secondary }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tickFormatter={formatAmount}
                tick={{ fontSize: 11, fill: theme.palette.text.secondary }}
                axisLine={false}
                tickLine={false}
                width={55}
              />
              <Tooltip content={<CustomBarTooltip />} cursor={{ fill: alpha(theme.palette.primary.main, 0.04) }} />
              <ReferenceLine
                y={avgPayment}
                stroke={theme.palette.warning.main}
                strokeDasharray="4 4"
                strokeWidth={1.5}
              />
              <Bar dataKey="amount" radius={[6, 6, 0, 0]}>
                {monthlyData.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={entry.month === 'Jun' ? theme.palette.primary.main : 'url(#barGradient)'}
                    opacity={entry.amount === 0 ? 0.2 : 1}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center', mt: 0.5 }}>
            Dashed line = monthly average · Jun highlighted = most recent
          </Typography>
        </CardContent>
      </Card>

      {/* Payment History Table */}
      <Card>
        <CardContent>
          <Typography variant="h6" fontWeight={700} gutterBottom>
            Payment History
          </Typography>
          <Box sx={{ overflowX: 'auto' }}>
            <TableContainer component={Paper} elevation={0} sx={{ border: `1px solid ${alpha(theme.palette.primary.main, 0.08)}` }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Payment Ref</TableCell>
                    <TableCell>Invoice</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>Method</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {MOCK_PAYMENTS.map((row) => (
                    <TableRow key={row.ref} hover>
                      <TableCell sx={{ fontWeight: 600 }}>{row.ref}</TableCell>
                      <TableCell sx={{ color: 'primary.main', fontWeight: 500 }}>{row.invoice}</TableCell>
                      <TableCell sx={{ color: 'text.secondary' }}>{row.date}</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>{formatFull(row.amount)}</TableCell>
                      <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' }, color: 'text.secondary' }}>{row.method}</TableCell>
                      <TableCell>
                        <Chip
                          label={row.status}
                          size="small"
                          color="success"
                          icon={<CheckCircleIcon sx={{ fontSize: '14px !important' }} />}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
