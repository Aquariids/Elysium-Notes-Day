import { update_action } from "../pages/api/actios";

export async function modeCode(selectedItem:any,code:any) {
    if (selectedItem) {
      const updatedLink = { ...selectedItem, code: !code}; 
      try {
        const updateRes = await fetch(
          `/api/updateData?action=${update_action.mode_code}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedLink),
          }
        );

      } catch (error) {
        console.error("Ошибка при обновлении данных:", error);
      }
    } else {
      console.error("Ссылка не найдена");
    }
  }