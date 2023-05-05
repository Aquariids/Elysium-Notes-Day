const icons = {
    bold: require('./img/bold.svg').default,
    superscript: require('./img/superscript.svg').default,
    subscript: require('./img/subscript.svg').default,

};


type iconId = "bold" | "superscript" | "subscript"
interface TypeIcon {
    icon: keyof typeof icons; // значение пропса должно быть ключем объекта icons
    className?: string
    id: iconId
}

const Icon = ({ icon, className, id }: TypeIcon) => {
    const IconComponent = icons[icon]; // передаем нужный ключ например "bold"
    return (
        <IconComponent /> // полученную иконку из объекта  используем как компонент
    )

};

export default Icon;