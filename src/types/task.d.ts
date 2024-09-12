export type Status = "enabled" | "disabled";
export type Task = {
    idtask: number;
    iduser: number;
    name: string;
    description: string;
    status: Status;
  };
  
  export type TaskRequest = Omit<Task, "idtask">;
  
  