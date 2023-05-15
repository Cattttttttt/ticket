import {
  ChangeEvent,
  ChangeEventHandler,
  FC,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { keyBy } from 'lodash-es';
import { classifyTicket, useCategories } from '@/api/category';
import { QueryWrapper } from '@/components/QueryWrapper';
import { PageContent, PageHeader } from '@/components/Page';
import { CategoryList } from '@/App/Categories';
import { usePersistFormData } from '../Tickets/New/usePersistFormData';
import { useDebouncedCallback } from 'use-debounce';
import { useRootCategory } from '@/states/root-category';
import { Link, useNavigate } from 'react-router-dom';

const DescriptionAndClassify = () => {
  const [description, setDescription] = useState<string>('');
  const [classifiedCategory, setClassifiedCategory] = useState<
    { name: string; id: string } | null | undefined
  >(undefined);
  const [loading, setLoading] = useState<boolean>(false);
  const category = useRootCategory();

  const { onChange: persist } = usePersistFormData(classifiedCategory?.id ?? '');

  useLayoutEffect(() => {
    if (classifiedCategory) {
      persist({ title: description, details: description });
    }
  }, [classifiedCategory, description]);

  const debouncedClassify = useDebouncedCallback(async (categoryId: string, content: string) => {
    setLoading(true);
    try {
      const v = await classifyTicket(categoryId, content);
      if (v.status === 'success') {
        setClassifiedCategory(v.data);
      } else {
        setClassifiedCategory(null);
      }
    } finally {
      setLoading(false);
    }
  }, 2000);

  return (
    <>
      <textarea
        onChange={(e) => {
          setDescription(e.target.value);
          debouncedClassify(category.id, description);
        }}
        value={description}
      />
      {
        <div>
          {loading ? (
            '正在探测...'
          ) : classifiedCategory ? (
            <>
              探测分类：
              <Link to={`/tickets/new?category_id=${classifiedCategory.id}`}>
                {classifiedCategory.name}
              </Link>
            </>
          ) : classifiedCategory === null ? (
            '探测失败'
          ) : null}
        </div>
      }
    </>
  );
};

export const TopCategoryList = () => {
  const { t } = useTranslation();
  const result = useCategories();
  const categories = result.data;

  const topCategories = useMemo(() => {
    if (!categories) {
      return [];
    }
    const map = keyBy(categories, 'id');
    return categories
      .filter((c) => !c.hidden)
      .filter((c) => c.parentId && !map[c.parentId])
      .sort((a, b) => a.position - b.position);
  }, [categories]);

  return (
    <>
      <PageContent shadow title="请描述你的问题" className="mb-2">
        <DescriptionAndClassify />
      </PageContent>

      <PageContent shadow title={t('category.select_hint_home')}>
        <QueryWrapper result={result}>
          <div className="-mb-3">
            <CategoryList marker={true} categories={topCategories} />
          </div>
        </QueryWrapper>
      </PageContent>
    </>
  );
};

export default function TopCategories() {
  const { t } = useTranslation();

  const result = useCategories();
  const title = result.isLoading ? t('general.loading') + '...' : t('category.title');

  return (
    <>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <PageHeader>{t('feedback.submit')}</PageHeader>

      <TopCategoryList />
    </>
  );
}
