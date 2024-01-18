import { useEffect, useState } from 'react'
import Link from 'next/link'
import { AiOutlineWarning } from 'react-icons/ai'
import ErrorMessages from '../ErrorMessages'
import Modal from '../Modal'
import { fromNow, useMutateApi } from '../../utils'
import Avatar from '../Avatar'

export default function PlayerReportComment ({ id, actor, created, comment, acl, serverId, onFinish }) {
  const [open, setOpen] = useState(false)
  const { load, data, loading, errors } = useMutateApi({
    query: `mutation deleteReportComment($id: ID!, $serverId: ID!) {
      deleteReportComment(id: $id, serverId: $serverId) {
        id
        acl {
          delete
        }
      }
    }`
  })

  useEffect(() => {
    if (!data) return
    if (Object.keys(data).some(key => !!data[key].id)) {
      setOpen(false)
      onFinish(data)
    }
  }, [data])
  const showConfirmDelete = (e) => {
    e.preventDefault()

    setOpen(true)
  }
  const handleConfirmDelete = async () => {
    await load({ id, serverId })
  }
  const handleDeleteCancel = () => setOpen(false)

  return (
    <div className='ml-4 pt-3 pb-3 relative' id={`comment-${id}`}>
      <Link href={`/player/${actor.id}`} className='absolute -left-20'>

        <Avatar uuid={actor.id} width={40} height={40} className='mx-1 inline-block relative' />

      </Link>
      <Modal
        icon={<AiOutlineWarning className='h-6 w-6 text-red-600' aria-hidden='true' />}
        title='Delete comment'
        confirmButton='Delete'
        open={open}
        onConfirm={handleConfirmDelete}
        onCancel={handleDeleteCancel}
        loading={loading}
      >
        <ErrorMessages errors={errors} />
        <p className='pb-1'>Are you sure you want to delete this comment?</p>
        <p className='pb-1'>This action cannot be undone</p>
      </Modal>
      <div className='-ml-7 md:-ml-4 border border-gray-700 rounded'>
        <div className='rounded-tl rounded-tr relative bg-gray-600 justify-between items-center flex border-b border-gray-600 py-2 px-4 text-sm text-gray-300'>
          <div className='items-center flex'>
            <span>
              <Link href={`/player/${actor.id}`} className='font-semibold'>
                {actor.name}
              </Link> commented&nbsp;
              <Link href={`#comment-${id}`}>

                <span>{fromNow(created)}</span>

              </Link>
            </span>
          </div>
          <div className='items-center flex'>
            {acl?.delete && <a className='cursor-pointer' onClick={showConfirmDelete}>Delete</a>}
          </div>
        </div>
        <div className='rounded-bl rounded-br relative p-4 bg-black top-0 bottom-0'>
          <p className='break-all'>{comment}</p>
        </div>
      </div>
    </div>
  )
}
