import {
  DndContext,
  useSensor,
  useSensors,
  // PointerSensor,
  MouseSensor,
  TouchSensor,
  DragOverlay,
  defaultDropAnimationSideEffects,
  closestCorners,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import Box from '@mui/material/Box';
import { useEffect, useState } from 'react';
import { mapOrder } from '~/utils/sort';
import ListColumns from './ListColumns/ListColumns';
import { cloneDeep } from 'lodash';

import Column from './ListColumns/Column/Column';
import Card from './ListColumns/Column/ListCards/Card/Card';

const ACTIVE_DRAG_ITEM_TYPE = {
  COLUMN: 'ACTIVE_DRAG_ITEM_TYPE_COLUMN',
  CARD: 'ACTIVE_DRAG_ITEM_TYPE_CARD',
};

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
  // Ở 1 thời điểm chỉ có 1 phần tử đang được kéo (column hoặc card)
  const [activeDragItemId, setActiveDragItemId] = useState(null);
  const [activeDragItemType, setActiveDragItemType] = useState(null);
  const [activeDragItemData, setActiveDragItemData] = useState(null);
  const [oldColumnDraggingCard, setOldColumnDraggingCard] = useState(null);

  useEffect(() => {
    setOrderedColumns(mapOrder(board?.columns, board?.columnOrderIds, '_id'));
  }, [board]);

  const findColumnByCardId = (cardId) => {
    return orderedColumns.find((column) =>
      column?.cards?.map((card) => card._id)?.includes(cardId),
    );
  };

  // Trigger khi bắt đầu kéo một phần tử
  const handleDragStart = (event) => {
    // console.log('handleDragStart', event);
    setActiveDragItemId(event?.active?.id);
    setActiveDragItemType(
      event?.active?.data?.current?.columnId
        ? ACTIVE_DRAG_ITEM_TYPE.CARD
        : ACTIVE_DRAG_ITEM_TYPE.COLUMN,
    );
    setActiveDragItemData(event?.active?.data?.current);

    // Nếu là kéo card thì mới thực hiện hành động set giá trị oldColumn
    if (event.active?.data?.current?.columnId) {
      setOldColumnDraggingCard(findColumnByCardId(event?.active?.id));
    }
  };

  // Trigger trong quá trình kéo một phần tử
  const handleDragOver = (event) => {
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) return;

    // console.log('handleDragOver', event);

    const { active, over } = event;

    if (!active || !over) return;

    const {
      id: activeDraggingCardId,
      data: { current: activeDraggingCardData },
    } = active;
    const { id: overCardId } = over;

    // Tìm 2 columns theo cardId
    const activeColumn = findColumnByCardId(activeDraggingCardId);
    const overColumn = findColumnByCardId(overCardId);

    if (!activeColumn || !overColumn) return;

    if (activeColumn._id !== overColumn._id) {
      setOrderedColumns((prevColumn) => {
        // Tìm vị trí của cái overCard trong column đích (nơi card sắp được thả)
        const overCardIndex = overColumn?.cards?.findIndex(
          (card) => card._id === overCardId,
        );

        let newCardIndex;
        const isBelowOverItem =
          active.rect.current.translated &&
          active.rect.current.translated.top > over.rect.top + over.rect.height;

        const modifier = isBelowOverItem ? 1 : 0;
        newCardIndex =
          overCardIndex >= 0
            ? overCardIndex + modifier
            : overColumn?.card?.length + 1;

        // Clone mảng orderedColumns cũ ra một cái mới để xử lý data rồi return - cập nhật lại orderedColumnsState mới
        const nextColumns = cloneDeep(prevColumn);
        const nextActiveColumn = nextColumns.find(
          (column) => column._id === activeColumn._id,
        );
        const nextOverColumn = nextColumns.find(
          (column) => column._id === overColumn._id,
        );

        if (nextActiveColumn) {
          // Xóa card ở cái column active (column cũ)
          nextActiveColumn.cards = nextActiveColumn.cards.filter(
            (card) => card._id !== activeDraggingCardId,
          );
          // Cập nhật lại mảng cardOrderIds cho chuẩn dữ liệu
          nextActiveColumn.cardOrderIds = nextActiveColumn.cards.map(
            (card) => card._id,
          );
        }

        if (nextOverColumn) {
          // Kiiểm tra xem card đang kéo nó có tồn tại ở overColumn chưa, nếu có thì cần xóa nó trước
          nextOverColumn.cards = nextOverColumn.cards.filter(
            (card) => card._id !== activeDraggingCardId,
          );
          // Thêm card đang kéo vào overColumn theo vị trí mới
          nextOverColumn.cards = nextOverColumn.cards.toSpliced(
            newCardIndex,
            0,
            activeDraggingCardData,
          );

          // Cập nhật lại mảng cardOrderIds cho chuẩn dữ liệu
          nextOverColumn.cardOrderIds = nextOverColumn.cards.map(
            (card) => card._id,
          );
        }

        return nextColumns;
      });
    }
  };

  // Trigger khi kết thúc hành động kéo thả một phần tử
  const handleDragEnd = (event) => {
    // console.log('handleDragEnd', event);
    const { active, over } = event;

    if (!active || !over) return;

    // Xử lý kéo thả Card
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) {
      const {
        id: activeDraggingCardId,
        data: { current: activeDraggingCardData },
      } = active;
      const { id: overCardId } = over;

      // Tìm 2 columns theo cardId
      const activeColumn = findColumnByCardId(activeDraggingCardId);
      const overColumn = findColumnByCardId(overCardId);

      if (!activeColumn || !overColumn) return;

      if (activeColumn._id !== oldColumnDraggingCard._id) {
        // Kéo thả card giữa 2 column khác nhau
        console.log('Kéo thả card giữa 2 column khác nhau');
      } else {
        // Kéo thả card trong cùng 1 column
        const oldCardIndex = oldColumnDraggingCard?.cards?.findIndex(
          (card) => card._id === activeDragItemId,
        );

        const newCardIndex = overColumn?.cards?.findIndex(
          (card) => card._id === overCardId,
        );

        const dndOrderedCards = arrayMove(
          oldColumnDraggingCard?.cards,
          oldCardIndex,
          newCardIndex,
        );

        setOrderedColumns((prevColumns) => {
          const nextColumns = cloneDeep(prevColumns);

          const targetColumn = nextColumns.find(
            (column) => column._id === overColumn._id,
          );

          targetColumn.cards = dndOrderedCards;
          targetColumn.cardOrderIds = dndOrderedCards.map((card) => card._id);

          return nextColumns;
        });
      }
    }

    // Xử lý kéo thả Column
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
      if (active.id !== over.id) {
        const oldColumnIndex = orderedColumns.findIndex(
          (column) => column._id === active.id,
        );

        const newColumnIndex = orderedColumns.findIndex(
          (column) => column._id === over.id,
        );

        // arrayMove dùng để sắp xếp lại mảng Columns ban đầu
        const dndOrderedColumns = arrayMove(
          orderedColumns,
          oldColumnIndex,
          newColumnIndex,
        );
        // const dndOrderedColumnIds = dndOrderedColumns.map((column) => column._id);

        setOrderedColumns(dndOrderedColumns);
      }
    }

    // Những dữ liệu sau khi kéo thả luôn phải đưa về giá trị null mặc định ban đầu
    setActiveDragItemId(null);
    setActiveDragItemType(null);
    setActiveDragItemData(null);
    setOldColumnDraggingCard(null);
  };

  // Animation khi thả (drop) phần tử - Test bằng cahs kéo xong thả trực tiếp và nhìn phần giữ chỗ overlay

  const customDropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: {
          opacity: 0.5,
        },
      },
    }),
  };

  return (
    <DndContext
      sensors={sensors}
      // Thuật toán phát hiện va chạm (nếu không có nó thì card với cover lớn sẽ không kéo qua Column được vì lúc này nó đang bị conflict giữa card và column)
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
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
        <DragOverlay dropAnimation={customDropAnimation}>
          {!activeDragItemType && null}
          {activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN && (
            <Column column={activeDragItemData} />
          )}
          {activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD && (
            <Card card={activeDragItemData} />
          )}
        </DragOverlay>
      </Box>
    </DndContext>
  );
};

export default BoardContent;
