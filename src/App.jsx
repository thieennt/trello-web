import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

function App() {
  return (
    <>
      <Button variant="text">Text</Button>
      <Button variant="contained">Contained</Button>
      <Button variant="outlined">Outlined</Button>

      <Typography variant="h1" color="text.primary">
        Hello World
      </Typography>
    </>
  );
}

export default App;
