import React, { useEffect, useState } from "react";
import FormInput from "../components/FormInput";

function AdminPanel() {
  const [malumot, setMalumot] = useState(() => {
    const saved = localStorage.getItem("malumot");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("malumot", JSON.stringify(malumot));
  }, [malumot]);

  const handleClick = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const name = formData.get("name");
    const versiya = formData.get("versiya");
    const narxi = formData.get("narxi");
    const number = Number(narxi);
    const yangiMalumot = {name, versiya, number};
    setMalumot((m)=>[...m, yangiMalumot])
    e.target.reset();
  };
  console.log(malumot)
  return (
    <div className="container flex flex-col text-left h-[100%] ml-auto w-full absolute items-center">
      <div className="text-2xl mb-3">Kompyuter yoki PS qo'shish</div>
      <form
        onSubmit={handleClick}
        className="flex flex-col gap-2 w-[400px] mr-auto ml-auto"
      >
        <FormInput name="name" label="Ko'myutermi yo PS ?" type="text" />
        <FormInput name="versiya" label="Qaysi versiya ?" type="text" />
        <FormInput name="narxi" label="Soatiga qancha so'mda ?" type="number" />
        <button>Qo'shish</button>
      </form>
    </div>
  );
}


export default AdminPanel;
