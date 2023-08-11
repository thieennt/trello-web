import AttachmentIcon from '@mui/icons-material/Attachment';
import CommentIcon from '@mui/icons-material/Comment';
import GroupIcon from '@mui/icons-material/Group';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { Card as MuiCard } from '@mui/material';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Card from './Card/Card';

const ListCards = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        p: '0 5px',
        m: '0 5px',
        overflowX: 'hidden',
        overflowY: 'auto',
        maxHeight: (theme) =>
          `calc(${theme.trello.boardContentHeight} - ${theme.spacing(5)} - ${
            theme.trello.columnHeaderHeight
          } - ${theme.trello.columnFooterHeight})`,
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: '#ced0da',
        },
        '&::-webkit-scrollbar-thumb:hover': {
          backgroundColor: '#bfc2cf',
        },
      }}
    >
      <MuiCard
        sx={{
          cursor: 'pointer',
          boxShadow: '0 1px 1px rgba(0, 0, 0, 0.2)',
          overflow: 'unset',
        }}
      >
        <CardMedia
          sx={{ height: 140 }}
          image="https://cdn4.buysellads.net/uu/1/127419/1670531697-AdobeTeams.jpg"
          title="green iguana"
        />
        <CardContent sx={{ p: 1.5, '&:last-child': { p: 1.5 } }}>
          <Typography>Trello App Using Material UI</Typography>
        </CardContent>
        <CardActions sx={{ p: '0 4px 8px 4px' }}>
          <Button size="small" startIcon={<GroupIcon />}>
            20
          </Button>
          <Button size="small" startIcon={<CommentIcon />}>
            15
          </Button>
          <Button size="small" startIcon={<AttachmentIcon />}>
            20
          </Button>
        </CardActions>
      </MuiCard>
      {/* List Card */}
      <Card />
      <Card temporaryHideMedia />
      <Card temporaryHideMedia />
      <Card temporaryHideMedia />
      <Card temporaryHideMedia />
      <Card temporaryHideMedia />
      <Card temporaryHideMedia />
      <Card temporaryHideMedia />
      <Card temporaryHideMedia />
      <Card temporaryHideMedia />
      <Card temporaryHideMedia />
    </Box>
  );
};

export default ListCards;
