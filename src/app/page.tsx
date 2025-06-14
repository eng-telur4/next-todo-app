'use client';

import { useEffect, useState } from 'react';
import { todo } from '@prisma/client';

export default function Home() {
    // SELECT
    const [todos, setTodos] = useState<todo[]>([]);
    // INSERT
    const [inputVal, setInputVal] = useState<string>("");

    // SELECT
    useEffect(() => {
        /**
         * fetchでGETメソッドをリクエスト
         * GETメソッドでは「SELECT * FROM todo;」を実行
         * レスポンスは取得結果がJSONでくる
         * 
         * useEffect()は引数の関数の実行タイミングをReactのレンダリング後まで遅らせるHook
         */
        const getTodo = async () => {
            // NEXT_PUBLIC_API_URL = "http://localhost:3000/api"
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/todo`, {method: "GET"});
            const data = await res.json();
            console.log(data);
            setTodos(data);
        };
        getTodo();
    }, []);

    // INSERT
    const postTodo = async () => {
        /**
         * 画面上部の「追加」ボタンを押すと呼び出されるイベントハンドラ
         * 
         * 画面上部のタイトル部分に何も入力していないとアラートを出す
         * inputValをPOSTメソッドでリクエストする
         */
        if (!inputVal) return alert('タイトルを入力してください');
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/todo`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: inputVal }),
        });
        const data = await res.json();
        setTodos([...todos, data]);
        setInputVal('');// InputValは空にする
    };

    // DELETE
    const deleteTodo = async (id: number) => {
        /**
         * 各項目のの「削除」ボタンを押すと呼び出されるイベントハンドラ
         * 
         * 引数にはtodoのidを渡してもらい、DELETEメソッドをリクエスト
         */
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/todo/${id}`, { method: 'DELETE' });
        const data = await res.json();
        setTodos(todos.filter((todo) => todo.id !== data.id));
    };

    // UPDATE
    const patchTodo = async (todo: todo) => {
        /**
         * 
         */
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/todo/${todo.id}`,
            {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isDone: !todo.isDone }),
            },
        );
        const data = await res.json();
        setTodos(
            todos.map((todo) => {
                if (todo.id === data.id) return data;
                else return todo;
            })
        );
    };

    return (
        <>
            {/* INSERT */}
            <input
                placeholder="タイトル入力"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}// 入力をinputValに反映
            />
            <button onClick={() => postTodo()}>追加</button>
            {todos.map((todo) => (
                <div key={todo.id}>
                    {/* UPDATE */}
                    <input
                        type="checkbox"
                        checked={todo.isDone}
                        onChange={() => patchTodo(todo)}
                    />
                    {/* SELECT */}
                    <p>{todo.id}</p>      {/* 1 */}
                    <p>{todo.title}</p>   {/* 掃除 */}
                    <p>{todo.content}</p> {/*  */}
                    <p>{todo.isDone}</p>  {/*  */}
                    <p>{new Date(todo.createdAt).toLocaleString()}</p>  {/* 2025/6/15 3:45:17 */}
                    <p>{new Date(todo.updatedAt).toLocaleString()}</p>  {/* 2025/6/15 3:45:17 */}
                    {/* DELETE */}
                    <button
                        onClick={() => deleteTodo(todo.id)}
                        className="bg-rose-400 px-2 py-1 rounded"
                    >
                        削除
                    </button>
                </div>
            ))}
        </>
    );
}

