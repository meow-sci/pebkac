export interface TabContentProps {
  label: string;
  step: React.ReactNode;
}

export function TabContent(props: TabContentProps) {
  return (
    <>
      <div className="line"></div>
      <span className="label">{props.label}</span>
      <div className="indicator" />
      <div className="step">{props.step}</div>
    </>

  )
}