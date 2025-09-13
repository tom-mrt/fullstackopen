const Header = (props) => <h1>{props.course}</h1>

const Content = ({ parts }) => (
  <div>
    {parts.map(part => {
      return (
        <Part key={part.id} part={part} />
      )
    })}
  </div>
)

const Part = (props) => (
  <p>
    {props.part.name} {props.part.exercises}
  </p>
)

const Total = (props) => <p>total of exercises {props.total}</p>

const Course = ({ course }) => {
  return (
    <>
    <Header course={course.name} />
    <Content parts={course.parts} />
    <Total total={
              course.parts.reduce((total, cur) => {
                console.log(cur);
                return total + cur.exercises
              }, 0)
            } />
    </>
  )
}

export default Course