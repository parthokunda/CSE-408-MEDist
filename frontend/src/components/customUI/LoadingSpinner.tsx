import { FC } from "react";

export const LoadingSpinner: FC = () => {
    return (
      <div
        className="inline-block my-10 h-12 w-12 animate-spin rounded-full border-4 border-solid border-c1 border-r-transparent align-[-0.125em] text-success motion-reduce:animate-[spin_1.5s_linear_infinite]"
        role="status"
      />
    );
  };