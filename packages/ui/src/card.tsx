import React, { JSX } from "react";

export function Card({
    title,
    children,
}: {
    title: string;
    children?: React.ReactNode;
}): JSX.Element {
    return (
        <div
            className="ui:border ui:p-4"
        >
            <h1 className="ui:text-xl ui:border-b ui:pb-2">
                {title}
            </h1>
            <p>{children}</p>
        </div>
    );
}

