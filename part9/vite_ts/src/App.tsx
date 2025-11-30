import { HeaderProps, ContentProps, TotalProps, PartProps, CoursePart } from './types';
import { assertNever } from './utils';

const App = () => {
  const courseName = "Half Stack application development";
  const courseParts: CoursePart[] = [
    {
    name: "Fundamentals",
    exerciseCount: 10,
    description: "This is an awesome course part",
    kind: "basic"
  },
  {
    name: "Using props to pass data",
    exerciseCount: 7,
    groupProjectCount: 3,
    kind: "group"
  },
  {
    name: "Basics of type Narrowing",
    exerciseCount: 7,
    description: "How to go from unknown to string",
    kind: "basic"
  },
  {
    name: "Deeper type usage",
    exerciseCount: 14,
    description: "Confusing description",
    backgroundMaterial: "https://type-level-typescript.com/template-literal-types",
    kind: "background"
  },
  {
    name: "TypeScript in frontend",
    exerciseCount: 10,
    description: "a hard part",
    kind: "basic",
  },
  {
  name: "Backend development",
  exerciseCount: 21,
  description: "Typing the backend",
  requirements: ["nodejs", "jest"],
  kind: "special"
}
  ];

  
  const totalExercises = courseParts.reduce((sum, part) => sum + part.exerciseCount, 0);

  const Header = (props: HeaderProps) => {
    return (
      <h1>{props.name}</h1>
    )
  };

  const Content = (props: ContentProps) => {
    return (
      <div>
        {props.courseParts.map(c => {
          return (
            <Part coursePart={c}/>
          )
        })}
      </div>
    );
  };

  const Total = (props: TotalProps) => {
    return (
      <p>Number of exercises {props.totalExercises}</p>
    )
  };


  const Part = (props: PartProps) => {
    switch (props.coursePart.kind) {
      case "basic":
        return (
          <div>
            <p>
            <strong>{props.coursePart.name} {props.coursePart.exerciseCount}</strong><br/>
            {props.coursePart.description}<br/>
            </p>
          </div>
        );
      case "group":
        return (
          <div>
            <p>
              <strong>{props.coursePart.name} {props.coursePart.exerciseCount}</strong><br/>
              project exercises {props.coursePart.groupProjectCount}<br/>
            </p>
          </div>
        );
      case "background":
        return (
          <div>
            <p>
              <strong>{props.coursePart.name} {props.coursePart.exerciseCount}</strong><br/>
              {props.coursePart.description}<br/>
              submit to {props.coursePart.backgroundMaterial}<br/>
            </p>
          </div>
        );
      case "special":
        const requirements: string = props.coursePart.requirements.join(", ")
        return (
          <div>
            <p>
              <strong>{props.coursePart.name} {props.coursePart.exerciseCount}</strong><br/>
              {props.coursePart.description}<br/>
              required skills: {requirements}<br/>
            </p>
          </div>
        )
      default:
        return assertNever(props.coursePart)

    }
  };


  return (
    <div>
      <Header name={courseName} />
      <Content courseParts={courseParts} />
      <Total totalExercises={totalExercises} />
    </div>
  );
};

export default App;