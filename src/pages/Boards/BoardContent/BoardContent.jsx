import {
  DndContext,
  useSensor,
  useSensors,
  // PointerSensor,
  MouseSensor,
  TouchSensor,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import Box from '@mui/material/Box';
import { useEffect, useState } from 'react';
import { mapOrder } from '~/utils/sort';
import ListColumns from './ListColumns/ListColumns';
const BoardContent = ({ board }) => {
  // const pointerSensor = useSensor(PointerSensor, {
  //   activationConstraint: { distance: 10 },
  // }); // Yêu cầu chuột di chuyển 10px thì mới kích hoạt event, fix trường hợp click bị gọi event
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: { distance: 10 },
  });
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: { delay: 250, tolerance: 500 },
  }); // Nhấn giữ 250ms và dung sai của cảm ứng thì mới kích hoạt

  // const sensors = useSensors(pointerSensor);
  const sensors = useSensors(mouseSensor, touchSensor);

  const [orderedColumns, setOrderedColumns] = useState([]);

  useEffect(() => {
    setOrderedColumns(mapOrder(board?.columns, board?.columnOrderIds, '_id'));
  }, [board]);

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over) return;

    if (active.id !== over.id) {
      const oldIndex = orderedColumns.findIndex(
        (column) => column._id === active.id,
      );

      const newIndex = orderedColumns.findIndex(
        (column) => column._id === over.id,
      );

      // arrayMove dùng để sắp xếp lại mảng Columns ban đầu
      const dndOrderedColumns = arrayMove(orderedColumns, oldIndex, newIndex);
      // const dndOrderedColumnIds = dndOrderedColumns.map((column) => column._id);

      setOrderedColumns(dndOrderedColumns);
    }
  };

  return (
    <DndContext onDragEnd={handleDragEnd} sensors={sensors}>
      <Box
        sx={{
          width: '100%',
          height: (theme) => theme.trello.boardContentHeight,
          bgcolor: (theme) =>
            theme.palette.mode === 'dark' ? '#34495e' : '#1976d2',
          p: '10px 0',
        }}
      >
        <ListColumns columns={orderedColumns} />
      </Box>
    </DndContext>
  );
};

export default BoardContent;
