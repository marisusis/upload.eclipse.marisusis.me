export default function itemsReducer(items, action) {
  switch (action.type) {
    case "add": {
      let file = null;
      if (action.file) {
        file = action.file;
      }

      return [
        ...items,
        {
          id: items.length > 0 ? items[items.length - 1].id + 1 : 0,
          file: file,
          progress: {
            loaded: 0,
            total: 0,
          },
          state: "idle",
        },
      ];
    }
    case "remove": {
      return items.filter((item) => item.id !== action.id);
    }
    case "update": {
      return items.map((item) => {
        if (item.id === action.item.id) {
          return action.item;
        }
        return item;
      });
    }
    default: {
      console.error("Unknown action", action);
      return items;
    }
  }
}
