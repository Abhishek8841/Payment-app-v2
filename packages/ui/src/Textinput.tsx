"use client"

export const TextInput = ({
    placeholder,
    onChange,
    label
}: {
    placeholder: string;
    onChange: (value: string) => void;
    label: string;
}) => {
    return <div className="ui:pt-2">
        <label className="ui:block ui:mb-2 ui:text-sm ui:font-medium ui:text-gray-900">{label}</label>
        <input onChange={(e) => onChange(e.target.value)} type="text" id="first_name" className="ui:bg-gray-50 ui:border ui:border-gray-300 ui:text-gray-900 ui:text-sm ui:rounded-lg ui:focus:ring-blue-500 ui:focus:border-blue-500 ui:block ui:w-full ui:p-2.5" placeholder={placeholder} />
    </div>
}

