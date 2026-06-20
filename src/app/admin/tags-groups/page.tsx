import TagGroupManager from './TagGroupManager';
import { getAllTags } from '@/lib/posts';

export default function TagsGroupsPage() {
  const tags = getAllTags();
  return <TagGroupManager initialTags={tags} />;
}
