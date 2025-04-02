import { AppLinks } from '@/shared/defines.ts';
import { cn } from '@/shared/libs/utils.ts';
import { Calendar } from '@shadcn/calendar.tsx';
import { Card, CardContent } from '@shadcn/card.tsx';
import { Popover, PopoverContent, PopoverTrigger } from '@shadcn/popover.tsx';
import { Textarea } from '@shadcn/textarea.tsx';
import { usePreferencesContext } from '@/providers/preferences.provider.tsx';
import { useAuthContext } from '@/providers/auth-provider.tsx';
import language from '@/shared/language.ts';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormControl, FormField, FormItem, FormLabel, FormMessage, Form } from '@shadcn/form.tsx';
import { Button } from '@shadcn/button.tsx';
import { Input } from '@shadcn/input.tsx';
import { CreateVotingDocument, GetAllActiveVotingDocument } from '@/graphql/generated.ts';
import BackwardHeader from '@/components/backward-header.tsx';
import { useMutation } from '@apollo/client';
import { format } from 'date-fns';
import { ArrowDown, ArrowUp, CalendarIcon, Trash } from 'lucide-react';
import { useFieldArray, useForm } from 'react-hook-form';
import { Navigate } from 'react-router';
import { z } from 'zod';

const formErrors = {
  title: { min: 'Title must be at least 5 characters.' },
  choices: { min: 'The number of options must be at least 3.' },
} as const;

const choiceFormSchema = z.object({
  label: z.string().min(3),
});

const formSchema = z.object({
  user: z.string().uuid(),
  description: z.string(),
  title: z.string().min(5, { message: formErrors.title.min }),
  choices: z.array(choiceFormSchema).min(3, { message: formErrors.choices.min }),
  finishIn: z.date(),
});

type FormFields = z.infer<typeof formSchema>

/*
 * =============================
 */

const PostPage = () => {
  const { user } = useAuthContext();
  const [{ lang }] = usePreferencesContext();
  const [createVoting, { loading }] = useMutation(CreateVotingDocument);
  
  const form = useForm<FormFields>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      user: user?.userId,
      title: '',
      description: '',
      finishIn: new Date(),
      choices: [
        { label: '' },
        { label: '' },
        { label: '' },
      ],
    },
  });
  
  const choices = useFieldArray({
    name: 'choices',
    control: form.control,
    rules: { minLength: 3, maxLength: 10 },
  });
  
  /*
   * ===================================
   */
  
  async function onSubmitHandler({ choices, description, finishIn, ...formFields }: FormFields) {
    const simpleChoices = choices.map(it => it.label);
    
    await createVoting({
      variables: {
        input: {
          ...formFields,
          choices: simpleChoices,
          description: description || null,
          finishIn: finishIn.toISOString(),
        },
      },
      // TODO: Почему то не работает
      awaitRefetchQueries: true,
      refetchQueries: [{ query: GetAllActiveVotingDocument, variables: {} }],
      onCompleted: () => {
        alert('Новое голосование успешно создано');
      },
      onError: (err) => {
        console.error(err.message);
        alert('Не удалось создать новое голосование');
      },
      
    });
    
    form.reset();
  }
  
  if (user === null) {
    return <Navigate to={AppLinks.login} />;
  }
  
  return (
    <>
      <BackwardHeader title={language.newVoting[lang]} />
      
      <div className="page-wrapper">
        <div className="page-content">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmitHandler)}>
              <FormField
                name="title"
                control={form.control}
                rules={{ required: true }}
                render={({ field }) => (
                  <FormItem className="mb-6">
                    <FormLabel>{language.title[lang]}</FormLabel>
                    
                    <FormControl>
                      <Input placeholder="shadcn" {...field} />
                    </FormControl>
                    
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                name="description"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="mb-6">
                    <FormLabel>{language.description[lang]}</FormLabel>
                    
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                name="finishIn"
                control={form.control}
                rules={{ required: true }}
                render={({ field }) => (
                  <FormItem className="mb-6">
                    <FormLabel>{language.finish[lang]}</FormLabel>
                    
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              'w-[100%] pl-3 text-left font-normal',
                              !field.value && 'text-muted-foreground',
                            )}
                          >
                            {field.value ? format(field.value, 'yyyy-MM-dd') : <span>Pick a date</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          lang="RU"
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date()}
                          onDayFocus={() => {
                            console.log("TEST");
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                    
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex flex-col gap-y-4 mb-6">
                {choices.fields.map((item, i) => (
                  <FormField
                    key={item.id}
                    name={`choices.${i}.label`}
                    control={form.control}
                    rules={{ required: true }}
                    render={({ field }) => {
                      return (
                        <FormItem>
                          <FormLabel>{language.choice[lang]} {i + 1}</FormLabel>
                          
                          <div className="flex flex-row gap-x-3">
                            <FormControl>
                              <Input
                                {...field}
                              />
                            </FormControl>
                            
                            <div className="flex flex-row gap-x-2">
                              <Button
                                type="button"
                                disabled={i === 0}
                                onClick={() => choices.swap(i, i - 1)}
                              >
                                <ArrowUp />
                              </Button>
                              
                              <Button
                                type="button"
                                disabled={i === choices.fields.length - 1}
                                onClick={() => choices.swap(i, i + 1)}
                              >
                                <ArrowDown />
                              </Button>
                              
                              <Button
                                type="button"
                                onClick={() => choices.remove(i)}
                                variant="destructive"
                                disabled={choices.fields.length < 4}
                              >
                                <Trash />
                              </Button>
                            </div>
                          </div>
                          
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />
                ))}
              </div>
              
              <div className="flex flex-row gap-x-2">
                <Button
                  type="submit"
                  children={language.sendData[lang]}
                  className="font-semibold"
                />
                
                {choices.fields.length < 7 && (
                  <Button
                    type="button"
                    children={language.addYet[lang]}
                    onClick={() => choices.append({ label: '' })}
                    className="font-semibold"
                  />
                )}
              </div>
            </form>
          </Form>
          
          {loading && (
            <p>Идет загрузка...</p>
          )}
        </div>
        
        <div className="page-sidebar">
          <Card className="py-5">
            <CardContent>
              <h2>Sidebar</h2>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default PostPage;