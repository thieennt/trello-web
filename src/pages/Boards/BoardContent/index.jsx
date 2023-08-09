import Box from '@mui/material/Box';

const BoardContent = () => {
  return (
    <Box
      sx={{
        width: '100%',
        height: (theme) =>
          `calc(100vh - ${theme.trello.appBarHeight} - ${theme.trello.boardBarHeight})`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 2,
        paddingX: 2,
        overflow: 'auto',
        bgcolor: (theme) =>
          // theme.palette.mode === 'dark' ? '#2f3542' : '#4834d4',
          theme.palette.mode === 'dark' ? '#34495e' : '#1976d2',
      }}
    >
      Board Content
    </Box>
  );
};

export default BoardContent;
