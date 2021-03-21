import { FormEvent, useEffect, useState } from "react";
import { useRef } from "react";

type ITodo = {
  ID: string;
  Text: string;
  Created: string;
};

export default function Index() {
  const [todos, setTodos] = useState<ITodo[]>([]);
  const [editId, setEditId] = useState<string>();
  const ref = useRef<HTMLInputElement>(null);
  const editRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("http://localhost:8080/read", {
          method: "GET",
          mode: "cors",
        });
        const data = await res.json();
        setTodos(data);
        console.log(data);
      } catch (error) {
        console.error(error);
      }
    })();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (ref.current) {
      if (ref.current.value.trim().length === 0) {
        alert("1文字以上入力してください(スペースを除く)");
        return;
      }
      try {
        const res = await fetch("http://localhost:8080/create", {
          method: "POST",
          mode: "cors",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: ref.current.value }),
        });
        const data = await res.json();
        setTodos(data);
        ref.current.value = "";
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleUpdate = async (id: string, text: string) => {
    try {
      const res = await fetch("http://localhost:8080/update", {
        method: "POST",
        mode: "cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, text }),
      });
      const data = await res.json();
      setTodos(data);
      setEditId(undefined);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("本当に削除しますか？")) {
      return;
    }
    try {
      const res = await fetch("http://localhost:8080/delete", {
        method: "POST",
        mode: "cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      setTodos(data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="m-[100px]">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          ref={ref}
          placeholder="やることを追加"
          className="border-gray-500 border rounded-sm mr-4"
        />
        <button
          type="submit"
          className="text-white bg-gray-500 rounded-md px-4">
          追加
        </button>
      </form>
      <ul>
        {todos &&
          todos.map(({ ID, Text }) => (
            <li key={ID}>
              {editId === ID ? (
                <>
                  <input
                    type="text"
                    className="border-gray-500 border rounded-sm mr-4"
                    ref={editRef}
                    defaultValue={Text}
                  />
                  <button onClick={() => setEditId(undefined)}>
                    キャンセル
                  </button>
                  <button
                    onClick={() => handleUpdate(ID, editRef.current!.value)}>
                    保存
                  </button>
                </>
              ) : (
                <>
                  <p>{Text}</p>
                  <button onClick={() => handleDelete(ID)}>削除</button>
                  <button onClick={() => setEditId(ID)}>編集</button>
                </>
              )}
            </li>
          ))}
      </ul>
    </div>
  );
}
