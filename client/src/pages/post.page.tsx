import { useRef, useState } from 'react';
import css from '../assets/css/pages/post.page.module.css';

const PostPage = () => {
  const defChoices = useRef(['', '', '']);
  const [choices, setChoices] = useState<string[]>(defChoices.current);
  
  function changeChoice(index: number, value: string) {
    setChoices((prev) => prev.map((it, i) => i !== index ? it : value));
  }
  
  function addYetChoice() {
    setChoices((prev) => [...prev, '']);
  }
  
  function onDeleteChoice(index: number) {
    setChoices((prev) => prev.filter((_, i) => i !== index));
  }
  
  function pushMokeData(data: IVoting) {
    return new Promise<void>(resolve => {
      setTimeout(() => {
        const prev = JSON.parse(window.localStorage.getItem('posts') || '[]');
        if (!Array.isArray(prev)) throw new Error('posts must be an array');
        
        window.localStorage.setItem('posts', JSON.stringify([...prev, data]));
        resolve();
      }, 300);
    });
  }
  
  async function onSubmitHandler(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    
    const target = e.currentTarget as HTMLFormElement;
    const formData = new FormData(target);
    const choices = formData.getAll('choices');
    
    await pushMokeData({
      id: (new Date()).getTime(),
      title: String(formData.get('title')),
      description: String(formData.get('description')),
      choices: Array.isArray(choices) ? choices.map(it => String(it)) : [],
    });
    
    target.reset();
    setChoices(defChoices.current);
  }
  
  return (
    <div className="main">
      <div className="container">
        <form onSubmit={onSubmitHandler}>
          <div className={css.form_fields}>
            <div className={css.form_field}>
              <label htmlFor="title" className={css.form_field__label}>Название опроса *</label>
              <input type="text" id="title" name="title" className={css.form_field__control} style={{ width: '100%' }} required />
            </div>
            
            <div className={css.form_field} style={{ marginBottom: '0.5rem' }}>
              <label htmlFor="description" className={css.form_field__label}>Описание</label>
              <textarea id="description" name="description" className={css.form_field__control} style={{ width: '100%' }}
                        rows={2} />
            </div>
            
            {choices.map((value, index) => (
              <div className={css.form_field} key={index}>
                <label htmlFor="" className={css.form_field__label}>Вариант {index + 1}</label>
                
                <div className={css.form_field__shell}>
                  {/* TODO: Тут будет grabber */}
                  
                  <input
                    required
                    type="text"
                    value={value}
                    name="choices"
                    placeholder="Вариант ответа"
                    className={css.form_field__control}
                    onChange={({ target }) => {
                      changeChoice(index, target.value);
                    }}
                  />
                  
                  <input
                    value="Del"
                    type="button"
                    data-color="red"
                    className={css.primary_btn}
                    disabled={choices.length <= 3}
                    onClick={() => onDeleteChoice(index)}
                  />
                </div>
              </div>
            ))}
          </div>
          
          <div className={css.form_actions}>
            <input type="submit" value="Post new voting" className={css.primary_btn} />
            
            {choices.length < 7 && (
              <input type="button" value="Add yet" className={css.primary_btn} onClick={addYetChoice} />
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostPage;