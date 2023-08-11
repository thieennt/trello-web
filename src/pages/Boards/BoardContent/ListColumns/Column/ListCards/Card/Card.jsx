import { Card as MuiCard } from '@mui/material';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

const Card = ({ temporaryHideMedia }) => {
  if (temporaryHideMedia) {
    return (
      <MuiCard
        sx={{
          cursor: 'pointer',
          boxShadow: '0 1px 1px rgba(0, 0, 0, 0.2)',
          overflow: 'unset',
        }}
      >
        <CardContent sx={{ p: 1.5, '&:last-child': { p: 1.5 } }}>
          <Typography>Card Hide Media 01</Typography>
        </CardContent>
      </MuiCard>
    );
  }

  return (
    <MuiCard
      sx={{
        cursor: 'pointer',
        boxShadow: '0 1px 1px rgba(0, 0, 0, 0.2)',
        overflow: 'unset',
      }}
    >
      <CardContent sx={{ p: 1.5, '&:last-child': { p: 1.5 } }}>
        <Typography>Card 01</Typography>
      </CardContent>
    </MuiCard>
  );
};

export default Card;
