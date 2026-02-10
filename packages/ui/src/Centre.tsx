import React from "react"

export const Center = ({ children }: { children: React.ReactNode }) => {
    return <div className="ui:flex ui:justify-center ui:flex-col ui:h-full">
        <div className="ui:flex ui:justify-center">
            {children}
        </div>
    </div>
}

