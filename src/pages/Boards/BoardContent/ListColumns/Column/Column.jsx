import AddCardIcon from '@mui/icons-material/AddCard';
import Cloud from '@mui/icons-material/Cloud';
import ContentCopy from '@mui/icons-material/ContentCopy';
import ContentCut from '@mui/icons-material/ContentCut';
import ContentPaste from '@mui/icons-material/ContentPaste';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import DragHandleIcon from '@mui/icons-material/DragHandle';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import ListCards from './ListCards/ListCards';
import { mapOrder } from '~/utils/sort';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const Column = ({ column }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: column._id, data: { ...column } });

  const dndKitColumnStyle = {
    // touchAction: 'none', // Dành cho sensor default dạng PointerSensor
    // Nếu sử dụng CSS.Transform như docs sẽ bị lỗi kiểu stretch (bị biến đổi)
    // Sử dụng CSS.Translate như bên dưới thì nó chỉ di chuyển chứ không bị biến đổi
    transform: CSS.Translate.toString(transform),
    transition,

    // Chiều cao phải luôn max vì nếu không sẽ lỗi lúc kéo column ngắn qua một cái column dài thì phải kéo ở khu vực giữa giữa rất khó chịu. Lưu ý: phải kết hợp với {...listeners} nằm ở Box chứ không nằm ở div ngoài cùng để trahs trường hợp kéo vùng xanh
    height: '100%',
    opacity: isDragging ? 0.5 : undefined,
  };

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const orderedCards = mapOrder(column?.cards, column?.cardOrderIds, '_id');

  return (
    // Phải bọc div ở đây vì vấn đề chiều cao của column khi kéo thả sẽ có bug kiểu flickering
    <div ref={setNodeRef} style={dndKitColumnStyle} {...attributes}>
      <Box
        {...listeners} // Chỉ lắng nghe khi kéo thả cái box
        sx={{
          minWidth: '300px',
          maxWidth: '300px',
          ml: 2,
          borderRadius: '6px',
          height: 'fit-content',
          maxHeight: (theme) =>
            `calc(${theme.trello.boardContentHeight} - ${theme.spacing(5)})`,
          bgcolor: (theme) =>
            theme.palette.mode === 'dark' ? '#333643' : '#ebecf0',
        }}
      >
        {/* Box Column Header */}

        <Box
          sx={{
            height: (theme) => theme.trello.columnHeaderHeight,
            p: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Typography
            variant="h6"
            sx={{ fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer' }}
          >
            {column?.title}
          </Typography>
          <Box>
            <Tooltip title="More options">
              <ExpandMoreIcon
                sx={{
                  color: 'text.primary',
                  cursor: 'pointer',
                }}
                id="basic-column-dropdown"
                aria-controls={open ? 'basic-menu-column-dropdown' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
              />
            </Tooltip>
            <Menu
              id="basic-menu-workspaces"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                'aria-labelledby': 'basic-button-workspaces',
              }}
            >
              <MenuItem>
                <ListItemIcon>
                  <AddCardIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Add new card</ListItemText>
              </MenuItem>
              <MenuItem>
                <ListItemIcon>
                  <ContentCut fontSize="small" />
                </ListItemIcon>
                <ListItemText>Cut</ListItemText>
              </MenuItem>
              <MenuItem>
                <ListItemIcon>
                  <ContentCopy fontSize="small" />
                </ListItemIcon>
                <ListItemText>Copy</ListItemText>
              </MenuItem>
              <MenuItem>
                <ListItemIcon>
                  <ContentPaste fontSize="small" />
                </ListItemIcon>
                <ListItemText>Paste</ListItemText>
              </MenuItem>
              <Divider />
              <MenuItem>
                <ListItemIcon>
                  <DeleteForeverIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Remove this column</ListItemText>
              </MenuItem>
              <MenuItem>
                <ListItemIcon>
                  <Cloud fontSize="small" />
                </ListItemIcon>
                <ListItemText>Archive this column</ListItemText>
              </MenuItem>
            </Menu>
          </Box>
        </Box>
        {/* Box List Card */}
        {orderedCards?.length > 0 && <ListCards cards={orderedCards} />}
        {/* Box Column Footer */}
        <Box
          sx={{
            height: (theme) => theme.trello.columnFooterHeight,
            p: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Button startIcon={<AddCardIcon />}>Add new card</Button>
          <Tooltip title="Drag to move">
            <DragHandleIcon sx={{ cursor: 'pointer' }} />
          </Tooltip>
        </Box>
      </Box>
    </div>
  );
};

export default Column;
