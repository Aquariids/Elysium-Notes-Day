export function sorting(body: any, sort:string) {
    try {
      const sortBody = body.sort((a: any, b: any) => {
        const dateA = Date.parse(a.date);
        const dateB = Date.parse(b.date);
  
        if (sort === "dateUp") return dateB - dateA; // Сравниваем в обратном порядке для сортировки от новых к старым
        if (sort === "dateDown") return dateA - dateB;
        if(!sort) return body;
      });
  
      return sortBody;
    }

    catch (err) {
      console.log(err);
      
    }

  }

