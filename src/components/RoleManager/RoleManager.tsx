"use client";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useEffect, useRef, useState } from "react";
import { HexColorPicker } from "react-colorful";
import { useMutation, useQuery, useQueryClient } from "react-query";

//@ts-expect-error
class CustomSensor extends PointerSensor {
  static activators = [
    {
      eventName: "onPointerDown",
      handler: ({ nativeEvent: event }) => {
        if (
          !event.isPrimary ||
          event.button !== 0 ||
          isInteractiveElement(event.target)
        ) {
          return false;
        }

        return true;
      },
    },
  ];
}

function isInteractiveElement(element) {
  const interactiveElements = [
    "button",
    "input",
    "textarea",
    "select",
    "option",
  ];

  if (interactiveElements.includes(element.tagName.toLowerCase())) {
    return true;
  }

  return false;
}

export default function RoleManager() {
  const queryClient = useQueryClient();
  const { data: roles, isLoading } = useQuery("roles", async () =>
    fetch("/api/bot/roles")
      .then((res) => res.json())
      .then((data) => {
        const roles = data
          .map((role) => ({
            name: role.name,
            id: role.id,
            position: role.rawPosition,
            color: role.color,
          }))
          .sort((a, b) => a.position - b.position);
        return roles;
      })
  );

  const sensors = useSensors(
    //@ts-expect-error
    useSensor(CustomSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const mutation = useMutation(
    async (newRoles) => {
      await fetch("/api/bot/rolePositions", {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          roles: newRoles,
        }),
      });
    },
    {
      onMutate: async (newRoles) => {
        await queryClient.cancelQueries("roles");
        const previousRoles = queryClient.getQueryData("roles");
        queryClient.setQueryData("roles", newRoles);
        return { previousRoles };
      },
    }
  );

  function handleDragEnd(event) {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldRole = roles.find((el) => el.id === active.id)!;
      const oldIndex = roles.indexOf(oldRole);
      const newRole = roles.find((el) => el.id === over.id)!;
      const newIndex = roles.indexOf(newRole);

      const newRoles: any = arrayMove(roles, oldIndex, newIndex);

      newRoles.forEach((role) => (role.position = newRoles.indexOf(role)));
      //   setRoles(newRoles);
      mutation.mutate(newRoles);
    }
  }

  const [formOpen, setFormOpen] = useState(false);

  return (
    <div className="flex flex-col">
      <div className="w-[600px] flex">
        <button
          onClick={() => setFormOpen((o) => !o)}
          className="mt-2 mr-6 w-1/3 grow bg-slate-800 py-2 px-5 rounded-lg text-white hover:bg-slate-900 transition-all duration-150"
        >
          Add Role
        </button>
        <div className="w-1/3 flex-col flex">
          {formOpen && <RoleForm color={"#fff"} name="Enter name" createRole />}
        </div>
      </div>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        {!isLoading && (
          <SortableContext items={roles} strategy={verticalListSortingStrategy}>
            {roles.map((role) => (
              <Role
                key={role.id}
                id={role.id}
                name={role.name}
                color={role.color}
              />
            ))}
          </SortableContext>
        )}
      </DndContext>
    </div>
  );
}

function Role(props) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: props.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const [open, setOpen] = useState(false);

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let handler = (e) => {
      if (!ref.current) return;
      if (!ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);

    return () => {
      document.removeEventListener("mousedown", handler);
    };
  }, []);
  const queryClient = useQueryClient();

  const handleDelete = useMutation(
    async () => {
      return fetch("/api/bot/editRole", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: props.id,
          deleteRole: true,
        }),
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("roles");
      },
    }
  );
  return (
    <div className="flex w-[600px] items-center mt-2">
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className="w-1/3 grow mr-6"
      >
        <div className="py-6 px-5 shadow-md rounded-md text-black w-full grow mr-4 flex justify-between items-center">
          <button onClick={() => setOpen((o) => !o)} className="w-3/4">
            {props.name}
          </button>
          <button onClick={() => handleDelete.mutate()}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 pointer-events-none"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
              />
            </svg>
          </button>
        </div>
      </div>
      <div className="w-1/3 flex-col flex">
        {open && (
          <div className="relative" ref={ref}>
            <RoleForm color={props.color} id={props.id} name={props.name} />
          </div>
        )}
      </div>
    </div>
  );
}

const RoleForm = (props) => {
  const [color, setColor] = useState(`#${props.color.toString(16)}`);

  function handleColor(color) {
    setColor(color);
  }

  function handleForm(e) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const body = Object.fromEntries(formData);
    const name = body.name as string;
    return newRole.mutate(name);
  }

  const queryClient = useQueryClient();
  const newRole = useMutation(
    async (name: string) => {
      return fetch("/api/bot/editRole", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: props.id,
          name,
          color,
          createRole: props.createRole,
        }),
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("roles");
      },
    }
  );

  return (
    <div className="relative">
      <form onSubmit={handleForm}>
        <input name="name" type="text" placeholder={props.name} />
        <div className="absolute mt-4">
          <HexColorPicker color={color} onChange={handleColor} />
          <button className="mt-2 bg-slate-800 w-full p-2 rounded-lg text-white hover:bg-slate-900 transition-all duration-150">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};
