import Detail from '../../../../app/events/[id]/page';
import events from '../../../events.json';
export function generateStaticParams() { return events.map(({id}) => ({id})); }
export default async function DemoEvent({params}: {params: Promise<{id:string}>}) {
  return <Detail params={params} />;
}
