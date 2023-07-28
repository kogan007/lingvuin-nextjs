"use client";
import { useEffect, useState } from "react";

export default function EmbedBuilder() {
  const [fieldCount, setFieldCount] = useState(0);
  const [channels, setChannels] = useState<{ name: string; id: string }[]>([]);
  const handleAddField = () => setFieldCount((count) => count + 1);

  useEffect(() => {
    fetch("/api/bot/channels")
      .then((res) => res.json())
      .then((data) => {
        const channels = data.map((channel) => ({
          name: channel.name,
          id: channel.id,
        }));
        setChannels(channels);
      });
  }, []);

  function handleForm(e) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget)) as Record<
      string,
      any
    >;
    const { content, title, description, channel } = data;
    fetch("/api/bot/postEmbed", {
      method: "POST",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content,
        title,
        description,
        channel,
      }),
    });
  }
  return (
    <form className="flex flex-col p-4" onSubmit={handleForm}>
      <div className="w-80">
        <div className="outline-none bg-slate-700 rounded-lg pl-4 pr-10 lg:pr-10 text-base leading-relaxed text-black-100 py-3">
          <select className="w-full bg-slate-800 text-white" name="channel">
            {channels.map((channel) => (
              <option key={channel.id} value={channel.id}>
                {channel.name}
              </option>
            ))}
          </select>
        </div>
        <div className="bg-slate-700 rounded-lg p-4 mt-2">
          <div className="outline-none bg-slate-800 rounded-lg pl-4 pr-10 lg:pr-10 text-base leading-relaxed text-black-100 py-3">
            <input
              name="content"
              type="text"
              placeholder="Content"
              className="bg-transparent text-white"
            />
          </div>
          <div className="outline-none bg-slate-800 rounded-lg pl-4 pr-10 lg:pr-10 text-base leading-relaxed text-black-100 py-3 mt-2">
            <input
              name="title"
              type="text"
              placeholder="Title"
              className="bg-transparent text-white"
            />
          </div>
          <div className="outline-none bg-slate-800 rounded-lg pl-4 pr-10 lg:pr-10 text-base leading-relaxed text-black-100 py-3 mt-2">
            <textarea
              name="description"
              placeholder="Description"
              className="bg-transparent w-full text-white"
            />
          </div>
          {[...new Array(fieldCount).keys()].map((i) => (
            <div
              className="outline-none bg-slate-800 rounded-lg pl-4 pr-10 lg:pr-10 text-base leading-relaxed text-black-100 py-3 mt-2"
              key={i}
            >
              <input
                name={`field_name-${i}`}
                placeholder="Field Name"
                className="bg-transparent w-full text-white"
              />
              <input
                name={`field_valu-${i}`}
                placeholder="Field Value"
                className="bg-transparent w-full text-white"
              />
            </div>
          ))}

          <div className="mt-2">
            <button
              type="button"
              className="text-sm text-blue-400"
              onClick={handleAddField}
            >
              + Add new field
            </button>
          </div>
        </div>
        <div className="outline-none bg-slate-700 rounded-lg pl-4 pr-10 lg:pr-10 text-base leading-relaxed text-black-100 py-3 mt-2">
          <button className="bg-slate-800 w-full p-2 rounded-lg text-white hover:bg-slate-900 transition-all duration-150">
            Submit
          </button>
        </div>
      </div>
    </form>
  );
}
